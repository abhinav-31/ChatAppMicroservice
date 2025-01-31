package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.*;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.exception.ChatNotFoundException;
import com.chatapplication.chat_notification.repository.GroupChatRepository;
import com.chatapplication.chat_notification.service.interfaces.IGroupChatService;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mongodb.client.result.DeleteResult;

import java.util.List;

import java.util.UUID;

@Service
@Transactional
public class GroupChatServiceImpl implements IGroupChatService {

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private GroupChatRepository groupChatRepository;
    @Autowired
    private RabbitTemplate rabbitTemplate;


    @Override
    public GroupChatCreateResDTO createGroupChat(GroupChatCreateReqDTO group) {
        // generate the group id
        String groupId_1 = generateGroupId();
        String groupFinalId = groupId_1 + group.getGroupName() + group.getAdmin();

        // create the group chat instance
        Chat groupChat = Chat.builder()
                .chatId(groupFinalId)
                .groupName(group.getGroupName())
                // by default there would be at least 1 member in the group i.e. admin
                .members(group.getMembers())
                .build();
        // add the group chat instance to the database
        Chat groupChatSave = mongoTemplate.save(groupChat);

        return GroupChatCreateResDTO.builder()
                .groupChatId(groupChatSave.getChatId())
                .admin(groupChatSave.getAdmin())
                .groupName(groupChatSave.getGroupName())
                .build();
    }

    // group id generator
    private String generateGroupId() {
        return UUID.randomUUID().toString();
    }

    @Override
    public Boolean addMembersToGroup(GroupChatAddMemReqDTO groupChatAddMemReqDTO) {
        // Get group from repository
        Chat groupChat = groupChatRepository.findByChatId(groupChatAddMemReqDTO.getGroupId()).orElseThrow(() -> new ChatNotFoundException("Group not found"));
        boolean b = groupChat.getMembers().addAll(groupChatAddMemReqDTO.getGroupMembers());
        // send notification to the group members that you are joined to the group
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.MEM_ADD_NOTIFICATION_ROUTING_KEY,groupChatAddMemReqDTO.getGroupMembers());
        return b;
    }

    @Override
    public Boolean removeMembersFromGroup(GroupChatRemoReqDTO groupChatRemoReqDTO) {
        // Get group from repository
        Chat groupChat = groupChatRepository.findByChatId(groupChatRemoReqDTO.getGroupId()).orElseThrow(()->new ChatNotFoundException("Group not found"));
        // get group members and then remove them
       return groupChat.getMembers().removeAll(groupChatRemoReqDTO.getGroupMembers());
    }

    @Override
    public void deleteGroupChatInstanceByMembers(DeleteGroupInstByMemDTO deleteGroupInstByMemDTO) {
        // remove the user from Group Chat
        Update update = new Update();
        update.pull("members",deleteGroupInstByMemDTO.getUser());
        mongoTemplate.updateFirst(Query.query(Criteria.where("chatId").is(deleteGroupInstByMemDTO.getGroupId())),update,Chat.class);
    }

    @Override
    public List<ChatResponseDTO> getGroupChatForUsers(String userId) {
        return List.of();
    }

    @Override
    public String deleteGroup(String groupId) {
        // Get the group
        Chat groupChat = groupChatRepository.findByChatId(groupId).orElseThrow(()-> new ChatNotFoundException("Group not found"));
        // delete the group
        DeleteResult deleteResult = mongoTemplate.remove(Query.query(Criteria.where("chatId").is(groupId)), Chat.class);
        return deleteResult.toString();
    }
}
