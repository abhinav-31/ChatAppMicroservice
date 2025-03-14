package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.*;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;
import com.chatapplication.chat_notification.exception.ChatNotFoundException;
import com.chatapplication.chat_notification.repository.GroupChatRepository;
import com.chatapplication.chat_notification.service.interfaces.IGroupChatService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.DeleteResult;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupChatServiceImpl implements IGroupChatService {

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private GroupChatRepository groupChatRepository;
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private SetOperations<String, String> setOps;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public GroupChatCreateResDTO createGroupChat(GroupChatCreateReqDTO group) {
        // generate the group id
        String groupId_1 = generateGroupId();
        String groupFinalId = groupId_1 + group.getGroupName() + group.getGroupAdmin();

        // create the group chat instance
        Chat groupChat = Chat.builder()
                .chatId(groupFinalId)
                .groupName(group.getGroupName())
                .admin(group.getGroupAdmin())
                // by default there would be at least 1 member in the group i.e. admin
                .members(group.getMembers())
                .messages(new ArrayList<>())
                .creationTimestamp(LocalDateTime.now(ZoneId.systemDefault()))
                .build();
        // add the group chat instance to the database
        Chat groupChatSave = mongoTemplate.save(groupChat);

        // store in the redis
        for (String member : group.getMembers()) {
            // create key for each user
            String key = "userGroups:" + member;
            setOps.add(key, groupChatSave.getChatId());
        }

        return GroupChatCreateResDTO.builder()
                .groupId(groupChatSave.getChatId())
                .admin(groupChatSave.getAdmin())
                .groupName(groupChatSave.getGroupName())
                .groupMembers(groupChatSave.getMembers())
                .build();
    }

    // group id generator
    private String generateGroupId() {
        return UUID.randomUUID().toString().substring(0, 7);
    }

    @Override
    public Boolean addMembersToGroup(GroupChatAddMemReqDTO groupChatAddMemReqDTO) {
        // Get group from repository
        Chat groupChat = groupChatRepository.findByChatId(groupChatAddMemReqDTO.getGroupId()).orElseThrow(() -> new ChatNotFoundException("Group not found"));
        boolean b = groupChat.getMembers().addAll(groupChatAddMemReqDTO.getGroupMembers());
        // send notification to the group members that you are joined to the group
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.MEM_ADD_NOTIFICATION_ROUTING_KEY, groupChatAddMemReqDTO.getGroupMembers());
        return b;
    }

    @Override
    public Boolean removeMembersFromGroup(GroupChatRemoveMemberReqDTO groupChatRemoReqDTO) {
        // Get group from repository
        Chat groupChat = groupChatRepository.findByChatId(groupChatRemoReqDTO.getGroupId()).orElseThrow(() -> new ChatNotFoundException("Group not found"));
        // get group members and then remove them
        return groupChat.getMembers().removeAll(groupChatRemoReqDTO.getGroupMembers());
    }

    @Override
    public void deleteGroupChatInstanceByMembers(DeleteGroupInstByMemDTO deleteGroupInstByMemDTO) {
        // remove the user from Group Chat
        Update update = new Update();
        update.pull("members", deleteGroupInstByMemDTO.getUser());
        mongoTemplate.updateFirst(Query.query(Criteria.where("chatId").is(deleteGroupInstByMemDTO.getGroupId())), update, Chat.class);
    }

    @Override
    public List<ChatResponseDTO> getGroupChatForUsers(String userId) {
        return List.of();
    }

    @Override
    public String deleteGroup(String groupId) {
        // Get the group
        Chat groupChat = groupChatRepository.findByChatId(groupId).orElseThrow(() -> new ChatNotFoundException("Group not found"));
        // delete the group
        DeleteResult deleteResult = mongoTemplate.remove(Query.query(Criteria.where("chatId").is(groupId)), Chat.class);
        return deleteResult.toString();
    }


    @Override
    public List<GetGroupChatResDTO> getGroupChat(String userId) {
        // Fetch group IDs from Redis
        String key = "userGroups:" + userId;
        Set<String> userGroups = setOps.members(key);

        // If `userGroups` is empty, fetch from MongoDB and store in Redis
        if (userGroups == null || userGroups.isEmpty()) {
            userGroups = fetchUserGroupsFromMongo(userId); // Fetch from DB

            if (!userGroups.isEmpty()) {
                setOps.add(key, userGroups.toArray(new String[0])); // Store in Redis
            }
        }

        List<GetGroupChatResDTO> responseList = new ArrayList<>();

        if (userGroups == null || userGroups.isEmpty()) {
            return responseList; // Return empty list
        }

        // Fetch all groups & messages in **one** MongoDB query
        List<Chat> mongoChats = fetchFilteredGroupChatsFromMongo(userGroups, userId);

        // Process each group
        for (Chat chat : mongoChats) {
            String groupId = chat.getChatId();

            // Fetch pending messages from Redis
            List<Message> pendingMessages = fetchMessagesFromRedis(groupId);

            // If pending messages exist → Merge with `seenBy`
            if (!pendingMessages.isEmpty()) {
                Map<LocalDateTime, List<String>> seenByMap = fetchSeenByFromRedis(groupId);

                for (Message msg : pendingMessages) {
                    List<String> seenUsers = seenByMap.getOrDefault(msg.getSentTimestamp(), new ArrayList<>());
                    msg.getSeenBy().addAll(seenUsers);
                }
            }

            // Combine MongoDb messages & updated Redis messages
            List<Message> allMessages = new ArrayList<>(chat.getMessages());
            allMessages.addAll(pendingMessages);

            // segregate messages into groupMessages and unreadGroupMessages
            List<Message> groupMessages = new ArrayList<>();
            List<Message> unreadGroupMessages = new ArrayList<>();
            for (Message msg : allMessages) {
                if (msg.getSender().equals(userId) || (msg.getSeenBy() != null && msg.getSeenBy().contains(userId))) {
                    groupMessages.add(msg);
                } else {
                    unreadGroupMessages.add(msg);
                }
            }

            // Convert `Chat` to `GetGroupChatResDTO`
            GetGroupChatResDTO groupChatResDTO = GetGroupChatResDTO.builder()
                    .groupId(chat.getChatId())
                    .groupName(chat.getGroupName())
                    .groupAdmin(chat.getAdmin())
                    .groupMembers(chat.getMembers())
                    .groupMessages(groupMessages)
                    .unreadGroupMessages(unreadGroupMessages)
                    .build();

            responseList.add(groupChatResDTO);
        }

        return responseList;
    }

    private List<Chat> fetchFilteredGroupChatsFromMongo(Set<String> groupIds, String userId) {
        Query query = new Query();

        // Fetch only groups (admin field must be present)
        Criteria groupCriteria = Criteria.where("_id").in(groupIds)
                .and("members").in(userId)
                .and("admin").exists(true);

        // Fetch groups, ensuring messages are included only if they exist
        query.addCriteria(groupCriteria);
        query.fields().include("groupId", "groupName", "admin", "members");
        query.fields().slice("messages", 100); // Fetch messages if they exist

        List<Chat> chats = mongoTemplate.find(query, Chat.class);
        return chats;
    }


    private List<Message> fetchMessagesFromRedis(String groupId) {
        String messageKey = "groupMessage:" + groupId;
        List<Object> redisMessages = redisTemplate.opsForList().range(messageKey, 0, -1);

        return (redisMessages == null || redisMessages.isEmpty())
                ? new ArrayList<>()
                : objectMapper.convertValue(redisMessages, new TypeReference<>() {
        });
    }

    private Map<LocalDateTime, List<String>> fetchSeenByFromRedis(String groupId) {
        HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();
        String seenKey = "seenBy:" + groupId;

        Map<Object, Object> redisData = hashOps.entries(seenKey);
        Map<LocalDateTime, List<String>> seenByMap = new HashMap<>();

        for (Map.Entry<Object, Object> entry : redisData.entrySet()) {
            LocalDateTime timestamp = LocalDateTime.parse(entry.getKey().toString());
            List<String> seenUsers = objectMapper.convertValue(entry.getValue(), new TypeReference<>() {
            });
            seenByMap.put(timestamp, seenUsers);
        }

        return seenByMap;
    }

    private Set<String> fetchUserGroupsFromMongo(String userId) {
        Query query = new Query(
                new Criteria().andOperator(
                        Criteria.where("members").in(userId), // User is a member
                        Criteria.where("admin").exists(true)  // Ensures it's a group chat
                )
        );

        query.fields().include("_id"); // Fetch only the group ID

        List<Chat> userChats = mongoTemplate.find(query, Chat.class);

        return userChats.stream().map(Chat::getChatId).collect(Collectors.toSet());
    }
}
