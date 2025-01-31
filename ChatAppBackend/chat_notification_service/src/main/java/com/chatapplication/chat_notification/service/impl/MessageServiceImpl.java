package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;
import com.chatapplication.chat_notification.exception.ChatNotFoundException;
import com.chatapplication.chat_notification.repository.GroupChatRepository;
import com.chatapplication.chat_notification.service.interfaces.IMessageService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.ArrayList;

import java.util.List;

@Service
@Transactional
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
    public void sendMessage(MessageDTO messageDTO) {
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.GROUP_MESSAGE_ROUTING_KEY, messageDTO);

        // save the message to the redis
        String key = "groupMessage:" + messageDTO.getGroupId();
        // create message object
        Message message = Message.builder()
                .sender(messageDTO.getSender())
                .content(messageDTO.getContent())
                .timestamp(LocalDateTime.now())
                .status("sent")
                .build();
        redisTemplate.opsForList().rightPush(key, message);
    }

    @Override
    public Chat getGroupMessageForChat(String groupId) {
        Chat groupChat = groupChatRepository.findByChatId(groupId).orElseThrow(()->new ChatNotFoundException("Group not found"));

        // check for pending messages in redis
        String redisKey = "groupMessage:" + groupId;
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
}
