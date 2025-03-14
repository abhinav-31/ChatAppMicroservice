package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.GroupStatusPayloadDTO;
import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.dto.MessageStatusPayloadDTO;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;
import com.chatapplication.chat_notification.exception.ChatNotFoundException;
import com.chatapplication.chat_notification.repository.GroupChatRepository;
import com.chatapplication.chat_notification.service.interfaces.IMessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
@Async
public class MessageServiceImpl implements IMessageService {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private RedisTemplate redisTemplate;
    @Autowired
    private GroupChatRepository groupChatRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void sendGroupMessage(MessageDTO messageDTO) {
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.GROUP_MESSAGE_ROUTING_KEY, messageDTO);

        // save the message to the redis
        String key = "group_message:" + messageDTO.getGroupId();
        // create message object
        Message message = Message.builder()
                .sender(messageDTO.getSender())
                .content(messageDTO.getContent())
                .sentTimestamp(messageDTO.getSentTimestamp())
                .seenBy(new ArrayList<>())
                .build();
        redisTemplate.opsForList().rightPush(key, message);
    }

    @Override
    public Chat getGroupMessageForChat(String userId) {
        Chat groupChat = groupChatRepository.findByChatId(userId).orElseThrow(() -> new ChatNotFoundException("Group not found"));

        // check for pending messages in redis
        String redisKey = "groupMessage:" + userId;
        List<Object> objects = redisTemplate.opsForList().range(redisKey, 0, -1);
        CollectionType collectionType = objectMapper.getTypeFactory().constructCollectionType(List.class, Message.class);
        List<Message> messagesInRedis = objectMapper.convertValue(objects, collectionType);

        if (!messagesInRedis.isEmpty()) {
            // combine messages db with redis
            List<Message> combinedMessage = new ArrayList<>(groupChat.getMessages());
            combinedMessage.addAll(messagesInRedis);
            // update the chat with combined message
            groupChat.setMessages(combinedMessage);
        }

        return groupChat;
    }

    @Override
    public synchronized void updateMessageStatus(MessageStatusPayloadDTO messageStatusPayloadDTO) {
        ListOperations<String, Object> listOps = redisTemplate.opsForList();
        String redisKey = "status:" + messageStatusPayloadDTO.getChatId();

        MessageStatusPayloadDTO statusPayloadDTO = MessageStatusPayloadDTO.builder()
                .status(messageStatusPayloadDTO.getStatus())
                .sentTimestamp(messageStatusPayloadDTO.getSentTimestamp())
                .messageDeliveredTimestamp(messageStatusPayloadDTO.getMessageDeliveredTimestamp())
                .messageReadTimestamp(messageStatusPayloadDTO.getMessageReadTimestamp())
                .build();
        listOps.rightPush(redisKey, statusPayloadDTO);

        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.UPDATE_STATUS_ROUTING_KEY, messageStatusPayloadDTO);
    }

    @Override
    public synchronized void updateGroupMessageSeenBy(GroupStatusPayloadDTO groupMessageStatusPayloadDTO) {
        HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();

        String seenKey = "seenBy:" + groupMessageStatusPayloadDTO.getGroupId();
        String sentTimestampKey = groupMessageStatusPayloadDTO.getSentTimestamp().toString();
        String userId = groupMessageStatusPayloadDTO.getUserId();

        // Get existing users for this sentTimestamp
        Object existingUsers = hashOps.get(seenKey, sentTimestampKey);

        Set<String> userSet = new HashSet<>();
        if (existingUsers != null) {
            userSet.addAll(Arrays.asList(existingUsers.toString().split(","))); // Convert to Set
        }
        userSet.add(userId); // Add new user

        // Store updated user list back in Redis
        hashOps.put(seenKey, sentTimestampKey, String.join(",", userSet));
    }

}