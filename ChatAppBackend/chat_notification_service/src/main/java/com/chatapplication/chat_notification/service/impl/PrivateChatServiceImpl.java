package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.GetPrivateChatResDTO;
import com.chatapplication.chat_notification.dto.MessageStatusPayloadDTO;
import com.chatapplication.chat_notification.dto.PrivateChatMsgSendReqDTO;
import com.chatapplication.chat_notification.dto.PrivateChatMsgSendResDTO;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;
import com.chatapplication.chat_notification.repository.PrivateChatRepository;
import com.chatapplication.chat_notification.service.interfaces.IPrivateChatService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.mongodb.client.result.DeleteResult;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Function;
import java.util.stream.Collectors;


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
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    // Methods for Private Chat
    @Override
    @Async
    public CompletableFuture<Void> sendMessage(PrivateChatMsgSendReqDTO privateChatMsgSendReqDTO) {
        String sender = privateChatMsgSendReqDTO.getParticipants().get(0);
        String receiver = privateChatMsgSendReqDTO.getParticipants().get(1);
        String content = privateChatMsgSendReqDTO.getMessage();
        Collections.sort(privateChatMsgSendReqDTO.getParticipants());

        String chatIdCacheKey = "chat:" + privateChatMsgSendReqDTO.getParticipants().get(0).substring(0, 14);
        String chatId = "";

        Message newMessage = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .sentTimestamp(privateChatMsgSendReqDTO.getSentTimestamp())
                .status("sent")
                .build();

        // Redis lock key
        String lockKey = "lock:" + chatIdCacheKey;
        String lockValue = UUID.randomUUID().toString();
        try {
            // Acquire Redis Lock
            Boolean lockAcquired = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue);
            if (Boolean.TRUE.equals(lockAcquired)) {
                if (Boolean.TRUE.equals(redisTemplate.hasKey(chatIdCacheKey))) {
                    chatId = (String) redisTemplate.opsForValue().get(chatIdCacheKey);
                } else {
                    // This will happen only if chatIdCacheKey get expired
                    // generate chatId
                    chatId = generateChatId(sender, receiver);
                    // check chat exist for chatId or not
                    Optional<Chat> existingChat = privateChatRepository.findByChatId(chatId);
                    if (existingChat.isEmpty()) {
                        Chat chat = Chat.builder()
                                .chatId(chatId)
                                .members(Arrays.asList(sender, receiver))
                                .messages(new ArrayList<>()) // initialize an empty message list to prevent duplication of first message
                                .creationTimestamp(LocalDateTime.now())
                                .deletedFor(new HashMap<>())
                                .build();
                        mongoTemplate.save(chat);
                    }
                    // store the chatId in the redis with expiring time
                    redisTemplate.opsForValue().set(chatIdCacheKey, chatId, Duration.ofDays(7));
                }

                String redisKey = "message:" + chatId;
                redisTemplate.opsForList().rightPush(redisKey, newMessage);

                PrivateChatMsgSendResDTO response = PrivateChatMsgSendResDTO.builder()
                        .chatId(chatId)
                        .message(newMessage)
                        .build();
                rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.MESSAGE_ROUTING_KEY, response);
            } else {
                throw new RuntimeException("Another process is handling this chat");
            }
        } finally {
            // Release lock only if it's still held by this instance
            if (lockValue.equals(redisTemplate.opsForValue().get(lockKey))) {
                redisTemplate.delete(lockKey);
            }
        }
        return CompletableFuture.completedFuture(null);
    }

    // Mark the chat as deleted for one user
    @Override
    public String deleteChat(String chatId, String userId) {
        Update update = new Update();
        update.set("deletedFor." + userId, LocalDateTime.now());
        mongoTemplate.updateFirst(Query.query(Criteria.where("chatID").is(chatId)), update, Chat.class);

        // check if the chat should be deleted entirely from the database
        Chat chat = mongoTemplate.findOne(Query.query(Criteria.where("chatId").is(userId)), Chat.class);
        if (chat != null && chat.getDeletedFor() != null) {
            boolean allDeleted = chat.getDeletedFor().size() == 2;
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
                .filter(message -> message.getSentTimestamp().equals(timeStamp))
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

    public List<GetPrivateChatResDTO> getPrivateChat(String senderId) {
        Query query = new Query();
        query.addCriteria(
                Criteria.where("members").in(senderId)
                        .and("admin").exists(false)
                        .orOperator(
                                Criteria.where("deletedFor." + senderId).exists(false),
                                Criteria.where("messages.sentTimestamp").gte("deletedFor." + senderId)
                        )
        );

        // Fetch chats from MongoDB
        List<Chat> chats = mongoTemplate.find(query, Chat.class);

        // Process each chat in parallel using parallelStream()
        return chats.parallelStream().map(chat -> {
            List<Message> redisMessages = fetchMessagesFromRedis(chat.getChatId());
            List<Message> dbMessages = chat.getMessages();

            List<Message> allMessages = new ArrayList<>(redisMessages);
            allMessages.addAll(dbMessages);

            return GetPrivateChatResDTO.builder()
                    .chatId(chat.getChatId())
                    .members(chat.getMembers())
                    .privateMessages(filterPrivateMessages(allMessages, senderId))
                    .unreadMessages(filterUnreadMessages(allMessages, senderId))
                    .build();
        }).toList();
    }


    private List<Message> fetchMessagesFromRedis(String chatId) {
        String redisKey = "message:" + chatId;
        List<Object> messagesInRedis = redisTemplate.opsForList().range(redisKey, 0, -1);

        if (messagesInRedis == null || messagesInRedis.isEmpty()) return new ArrayList<>();

        List<Message> redisMessages = objectMapper.convertValue(messagesInRedis, new TypeReference<>() {
        });
        return fetchAndUpdateMessageStatus(redisMessages, chatId);
    }

    private List<Message> fetchAndUpdateMessageStatus(List<Message> messages, String chatId) {
        String redisStatusKey = "status:" + chatId;
        List<Object> statuses = redisTemplate.opsForList().range(redisStatusKey, 0, -1);

        if (statuses == null || messages.isEmpty()) return messages;

        Map<LocalDateTime, MessageStatusPayloadDTO> statusMap = objectMapper.convertValue(statuses, new TypeReference<List<MessageStatusPayloadDTO>>() {
                })
                .stream()
                .collect(Collectors.toMap(
                        MessageStatusPayloadDTO::getSentTimestamp,
                        Function.identity(),
                        (existing, incoming) -> "read".equals(incoming.getStatus()) ? incoming : existing
                ));

        messages.forEach(msg -> {
            MessageStatusPayloadDTO status = statusMap.get(msg.getSentTimestamp());
            if (status != null) {
                msg.setStatus(status.getStatus());
                msg.setMessageDeliveredTimestamp(status.getMessageDeliveredTimestamp());
                msg.setMessageReadTimestamp(status.getMessageReadTimestamp());
            }
        });

        return messages;
    }

    private List<Message> filterPrivateMessages(List<Message> messages, String senderId) {
        return messages.stream()
                .filter(message -> senderId.equals(message.getSender()) || "read".equals(message.getStatus()))
                .toList();
    }

    private List<Message> filterUnreadMessages(List<Message> messages, String senderId) {
        return messages.stream()
                .filter(message -> !senderId.equals(message.getSender()) && message.getMessageReadTimestamp() == null)
                .toList();
    }

}