package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.PrivateChatResDTO;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;
import com.chatapplication.chat_notification.exception.ChatNotFoundException;
import com.chatapplication.chat_notification.repository.PrivateChatRepository;
import com.chatapplication.chat_notification.service.interfaces.IPrivateChatService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import java.util.*;

import lombok.extern.slf4j.Slf4j;

import org.modelmapper.ModelMapper;

import com.mongodb.client.result.DeleteResult;


@Slf4j
@Service
@Transactional
public class PrivateChatServiceImpl implements IPrivateChatService {
    @Autowired
    private PrivateChatRepository privateChatRepository;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    ObjectMapper objectMapper;

    // Methods for Private Chat
    @Override
    public Chat sendMessage(String sender, String receiver, String content) {
        Message newMessage = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .status("sent")
                .deleted(false)
                .build();

        String chatId = generateChatId(sender,receiver);
        String redisKey = "message:" + chatId;

        redisTemplate.opsForList().rightPush(redisKey, modelMapper.map(newMessage, Object.class));
        PrivateChatResDTO response = PrivateChatResDTO.builder()
                .chatId(chatId)
                .message(newMessage)
                .build();
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.MESSAGE_ROUTING_KEY, response);

        Optional<Chat> existingChat = privateChatRepository.findByChatId(chatId);
        if (existingChat.isEmpty()) {
            Chat newChat = Chat.builder()
                    .chatId(chatId)
                    .members(Arrays.asList(sender, receiver))
                    .messages(List.of(newMessage))
                    .timestamp(LocalDateTime.now())
                    .deletedFor(new HashMap<>())
                    .lastSeenMessageTimestamp(new HashMap<>())
                    .build();
            mongoTemplate.save(newChat);
            return newChat;
        }
        return existingChat.get();
    }

    private String generateChatId(String sender, String receiver) {
        List<String> participants = Arrays.asList(sender, receiver);
        Collections.sort(participants);
        return String.join("-", participants) + "-" + UUID.randomUUID().toString().substring(0, 8);
    }


    // Mark the chat as deleted for one user
    @Override
    public String deleteChat(String chatId, String userId) {
        Update update = new Update();
        update.set("deletedFor." + userId, true);
        mongoTemplate.updateFirst(Query.query(Criteria.where("chatID").is(chatId)), update, Chat.class);

        // check if the chat should be deleted entirely from the database
        Chat chat = mongoTemplate.findOne(Query.query(Criteria.where("chatId").is(userId)), Chat.class);
        if (chat != null && chat.getDeletedFor() != null) {
            boolean allDeleted = chat.getDeletedFor()
                    .values()
                    .stream()
                    .allMatch(Boolean::booleanValue);
            if (allDeleted) {
                DeleteResult deleteResult = mongoTemplate.remove(Query.query(Criteria.where("chatId").is(chatId)), Chat.class);
                return deleteResult.toString();
            }
        }
        // for now
        return "Chat: " + chatId + " deleted for " + userId;
    }

    // Update the message status(sent, delivered, read)
    @Override
    public String updateMessageStatus(String chatId, LocalDateTime timeStamp, String status) {
        String redisKey = "message:" + chatId;

        // fetch all messages from redis for the given chatId
        List<Object> objects = redisTemplate.opsForList().range(redisKey, 0, -1);
        CollectionType collectionType = objectMapper.getTypeFactory().constructCollectionType(List.class, Message.class);
        List<Message> messages = objectMapper.convertValue(objects, collectionType);
        messages.stream()
                .filter(message -> message.getTimestamp().equals(timeStamp))
                .forEach(message -> {
                    message.setStatus(status);
                    // send the updated message status to the sender
                    simpMessagingTemplate.convertAndSend("/queue/private_chat/" + message.getSender(), message);
                });
        // clear and update the redis with modified messages list
        redisTemplate.delete(redisKey);
        redisTemplate.opsForList().rightPushAll(redisKey, messages);
        return "Message status updated for chat: " + chatId;
    }

    // get private chat between two uses
    public Chat getPrivateChat(String chatId) {
        // fetch chat from db
        Chat chat = privateChatRepository.findByChatId(chatId).orElseThrow(() -> new ChatNotFoundException("Chat with chatId: " + chatId + " not found"));

        // check for pending messages in redis
        String redisKey = "message:" + chatId;
        List<Object> objects = redisTemplate.opsForList().range(redisKey, 0, -1);
        CollectionType collectionType = objectMapper.getTypeFactory().constructCollectionType(List.class, Message.class);
        List<Message> messagesInRedis = objectMapper.convertValue(objects, collectionType);

        if (!messagesInRedis.isEmpty()) {
            // combine messages db with redis
            List<Message> combinedMessage = new ArrayList<>(chat.getMessages());
            combinedMessage.addAll(messagesInRedis);
            // update the chat with combined message
            chat.setMessages(combinedMessage);
        }
        return chat;
    }
}