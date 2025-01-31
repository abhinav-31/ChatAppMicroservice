//package com.chatapplication.chat_notification.scheduler;
//
//import com.chatapplication.chat_notification.entity.Chat;
//import com.chatapplication.chat_notification.entity.Message;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.type.CollectionType;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.mongodb.core.BulkOperations;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.core.query.Query;
//import org.springframework.data.mongodb.core.query.Update;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import lombok.extern.slf4j.Slf4j;
//
//import org.modelmapper.ModelMapper;
//
//import java.io.IOException;
//
//import java.time.LocalDateTime;
//
//import java.util.*;
//
//
//@Slf4j
//@Component
//public class BatchUpdateScheduler {
//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;
//    @Autowired
//    private MongoTemplate mongoTemplate;
//    @Autowired
//    private ObjectMapper objectMapper;
//    @Autowired
//    private ModelMapper modelMapper;
//
//    @Scheduled(fixedRate = 300000) // 5 minutes
//    @Transactional
//    public void updatePrivateChat() throws IOException {
//        log.info("UpdateChat scheduler started at: {}", LocalDateTime.now());
//
//        Set<String> keys = redisTemplate.keys("message:*");
//        if (keys.isEmpty()) {
//            log.info("No keys found in Redis.");
//            return;
//        }
//
//        for (String key : keys) {
//            log.info("Processing Redis key: {}", key);
//
//            List<Object> objects = redisTemplate.opsForList().range(key, 0, -1);
//
//            if (objects == null || objects.isEmpty()) {
//                log.info("No messages found for key: {}", key);
//                continue;
//            }
//            CollectionType listType = objectMapper.getTypeFactory().constructCollectionType(List.class, Message.class);
//            List<Message> messages = objectMapper.convertValue(objects, listType);
//
//            log.info("Messages: {}", messages);
//            BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.ORDERED, Chat.class);
//
//            for (Message message : messages) {
//                Query query = Query.query(Criteria.where("_id").is(key.split(":")[1]));
//                Update update = new Update().push("messages", message);
//                bulkOps.updateOne(query, update);
//            }
//
//            bulkOps.execute();
//            redisTemplate.delete(key);
//            log.info("Synced and deleted Redis key: {}", key);
//        }
//        log.info("UpdateChat scheduler completed at: {}", LocalDateTime.now());
//    }
//
//    @Scheduled(fixedRate = 300000) // 5 minutes
//    @Transactional
//    public void updatePrivateChatMessageStatusInBatch() {
//        log.info("UpdateMessageStatusInBatch scheduler started at: {}", LocalDateTime.now());
//        // Fetch all Redis keys matching the pattern
//        Set<String> keys = redisTemplate.keys("message:*");
//
//        if (keys.isEmpty()) {
//            return; // Exit if no keys found
//        }
//
//        for (String key : keys) {
//            try {
//                String chatId = key.split(":")[1];
//
//                // Fetch all messages for the current chatId from Redis
//                List<Object> objects = redisTemplate.opsForList().range(key, 0, -1);
//                if (objects == null || objects.isEmpty()) {
//                    log.info("No messages in redis found for key: {}", key);
//                    continue;
//                }
//                CollectionType collectionType = objectMapper.getTypeFactory().constructCollectionType(List.class, Message.class);
//                List<Message> messages = objectMapper.convertValue(objects, collectionType);
//
//                if (!messages.isEmpty()) {
//                    // Prepare updates for all messages in a batch
//                    BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class);
//
//                    for (Message message : messages) {
//                        // Update only the message with the specific timestamp
//                        Criteria criteria = Criteria.where("chatId").is(chatId).and("messages.timestamp").is(message.getTimestamp());
//
//                        Update update = new Update();
//                        update.set("messages.$.status", message.getStatus());
//                        // Add the operation to the batch
//                        bulkOps.updateOne(Query.query(criteria), update);
//                    }
//                    // Execute the batch update
//                    bulkOps.execute();
//                    // Remove the processed key from Redis
//                    redisTemplate.delete(key);
//                }
//            } catch (Exception e) {
//                // Log the error and continue processing other keys
//                log.error("Error processing Redis key: {}", key);
//                log.error("Error: {}", e.getMessage());
//            }
//        }
//    }
//
//    @Scheduled(fixedRate = 300000) // 5 minutes
//    @Transactional
//    public void updateGroupChatMessage() {
//
//        // Get the keys
//        Set<String> keys = redisTemplate.keys("groupMessage:*");
//        if (keys.isEmpty()) {
//            log.info("No keys found in Redis.");
//            return;
//        }
//
//        for (String key : keys) {
//            List<Object> objects = redisTemplate.opsForList().range(key, 0, -1);
//            if (objects == null || objects.isEmpty()) {
//                log.info("No messages found for key: {}", key);
//                continue;
//            }
//            CollectionType listType = objectMapper.getTypeFactory().constructCollectionType(List.class, Message.class);
//            List<Message> messages = objectMapper.convertValue(objects, listType);
//
//            BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.ORDERED, Chat.class);
//
//            for (Message message : messages) {
//                Query query = Query.query(Criteria.where("_id").is(key.split(":")[1]));
//                Update update = new Update().push("messages", message);
//                bulkOps.updateOne(query, update);
//            }
//            bulkOps.execute();
//            redisTemplate.delete(key);
//        }
//    }
//}

package com.chatapplication.chat_notification.scheduler;

import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Set;
import java.util.function.BiFunction;

@Slf4j
@Component
public class BatchUpdateScheduler {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private static final String PRIVATE_MSG_NEW_KEY_PATTERN = "message:new:*";
    private static final String PRIVATE_MSG_STATUS_KEY_PATTERN = "message:status:*";
    private static final String GROUP_MSG_NEW_KEY_PATTERN = "groupMessage:new:*";

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void updatePrivateChat() throws IOException {
        log.info("UpdateChat scheduler started at: {}", LocalDateTime.now());
        processKeys(PRIVATE_MSG_NEW_KEY_PATTERN, this::processNewMessages);
        log.info("UpdateChat scheduler completed at: {}", LocalDateTime.now());
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void updatePrivateChatMessageStatusInBatch() {
        log.info("UpdateMessageStatusInBatch scheduler started at: {}", LocalDateTime.now());
        processKeys(PRIVATE_MSG_STATUS_KEY_PATTERN, this::processStatusUpdates);
        log.info("UpdateMessageStatusInBatch scheduler completed at: {}", LocalDateTime.now());
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void updateGroupChatMessage() {
        log.info("GroupChatMessage scheduler started at: {}", LocalDateTime.now());
        processKeys(GROUP_MSG_NEW_KEY_PATTERN, this::processNewMessages);
        log.info("GroupChatMessage scheduler completed at: {}", LocalDateTime.now());
    }

    private void processKeys(String keyPattern, BiFunction<String, List<Message>, BulkOperations> processor) {
        Set<String> keys = redisTemplate.keys(keyPattern);
        if (keys == null || keys.isEmpty()) {
            log.info("No keys found for pattern: {}", keyPattern);
            return;
        }

        keys.forEach(key -> {
            try {
                List<Object> redisMessages = redisTemplate.opsForList().range(key, 0, -1);
                if (redisMessages == null || redisMessages.isEmpty()) {
                    log.info("No messages found for key: {}", key);
                    redisTemplate.delete(key);
                    return;
                }

                List<Message> messages = convertRedisMessages(redisMessages);
                BulkOperations bulkOps = processor.apply(key, messages);

                if (bulkOps != null) {
                    bulkOps.execute();
                    redisTemplate.delete(key);
                    log.info("Processed and deleted Redis key: {}", key);
                }
            } catch (Exception e) {
                log.error("Error processing key {}: {}", key, e.getMessage(), e);
            }
        });
    }

    private List<Message> convertRedisMessages(List<Object> redisMessages) {
        CollectionType messageListType = objectMapper.getTypeFactory()
                .constructCollectionType(List.class, Message.class);
        return objectMapper.convertValue(redisMessages, messageListType);
    }

    private BulkOperations processNewMessages(String key, List<Message> messages) {
        String chatId = extractChatId(key);
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.ORDERED, Chat.class);

        messages.forEach(message -> {
            Query query = Query.query(Criteria.where("_id").is(chatId));
            Update update = new Update().push("messages", message);
            bulkOps.updateOne(query, update);
        });

        return bulkOps;
    }

    private BulkOperations processStatusUpdates(String key, List<Message> messages) {
        String chatId = extractChatId(key);
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class);

        messages.forEach(message -> {
            Criteria criteria = Criteria.where("_id").is(chatId)
                    .and("messages.timestamp").is(message.getTimestamp());
            Update update = new Update().set("messages.$.status", message.getStatus());
            bulkOps.updateOne(Query.query(criteria), update);
        });

        return bulkOps;
    }

    private String extractChatId(String key) {
        String[] parts = key.split(":");
        return parts[parts.length - 1]; // Handles nested colons in chatId
    }
}