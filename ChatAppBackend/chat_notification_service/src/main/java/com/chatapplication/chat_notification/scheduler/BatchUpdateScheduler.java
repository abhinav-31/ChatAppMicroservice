package com.chatapplication.chat_notification.scheduler;

import com.chatapplication.chat_notification.dto.MessageStatusPayloadDTO;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.entity.Message;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Component
public class BatchUpdateScheduler {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    private static final String PRIVATE_MSG_NEW_KEY_PATTERN = "message:*";
    private static final String PRIVATE_MSG_STATUS_KEY_PATTERN = "status:*";
    private static final String GROUP_MSG_NEW_KEY_PATTERN = "group_message:*";
    private static final String GROUP_MSG_SEEN_BY_PATTERN = "seenBy:*";

    private static final int THREAD_POOL_SIZE = 4; // Adjust based on workload
    private final ExecutorService executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void updatePrivateChat() throws IOException {
        log.info("UpdateChat scheduler started at: {}", LocalDateTime.now());
        processChatMessages();
        log.info("UpdateChat scheduler completed at: {}", LocalDateTime.now());
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void updateGroupChat() throws IOException {
        log.info("Group UpdateChat scheduler started at: {}", LocalDateTime.now());
        processGroupChatMessages();
        log.info("Group UpdateChat scheduler completed at: {}", LocalDateTime.now());
    }

    private void processChatMessages() {
        Set<String> messageKeys = redisTemplate.keys(PRIVATE_MSG_NEW_KEY_PATTERN);
        Set<String> statusKeys = redisTemplate.keys(PRIVATE_MSG_STATUS_KEY_PATTERN);

        if ((messageKeys == null || messageKeys.isEmpty()) && (statusKeys == null || statusKeys.isEmpty())) {
            log.info("No messages or statuses found in Redis");
            return;
        }

        List<Future<?>> futures = new ArrayList<>();

        // Process messages in parallel
        if (messageKeys != null) {
            for (String messageKey : messageKeys) {
                futures.add(executorService.submit(() -> processSingleChat(messageKey)));
            }
        }

        // Process statuses in parallel
        if (statusKeys != null) {
            for (String statusKey : statusKeys) {
                futures.add(executorService.submit(() -> updateStatusesOnly(statusKey)));
            }
        }

        // Wait for all tasks to complete
        waitForCompletion(futures);
    }

    private void processSingleChat(String messageKey) {
        String chatId = extractChatId(messageKey);
        String statusKey = "status:" + chatId;

        List<Message> messages = fetchMessagesFromRedis(messageKey);
        List<MessageStatusPayloadDTO> statuses = fetchStatusesFromRedis(statusKey);

        if (messages.isEmpty()) {
            log.info("No messages found for chat: {}, updating statuses only.", chatId);
            updateStatusesOnly(statusKey);
            redisTemplate.delete(messageKey);
            return;
        }

        updateMessagesWithStatuses(chatId, messages, statuses);

        // Cleanup Redis keys
        redisTemplate.delete(messageKey);
        redisTemplate.delete(statusKey);
    }

    // directly updating the statuses in the mongo db
    private void updateStatusesOnly(String statusKey) {
        String chatId = extractChatId(statusKey);
        List<MessageStatusPayloadDTO> statuses = fetchStatusesFromRedis(statusKey);

        if (statuses.isEmpty()) {
            log.info("No statuses found for chat: {}", chatId);
            redisTemplate.delete(statusKey);
            return;
        }

        log.info("Updating statuses for existing messages in chat: {}", chatId);
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.ORDERED, Chat.class);

        statuses.forEach(status -> {
            Query query = Query.query(Criteria.where("_id").is(chatId).and("messages.sentTimestamp").is(status.getSentTimestamp()));
            Update update = new Update();
            update.set("messages.$.status", status.getStatus());
            if (status.getMessageDeliveredTimestamp() != null) {
                update.set("messages.$.messageDeliveredTimestamp", status.getMessageDeliveredTimestamp());
            }
            if (status.getMessageReadTimestamp() != null) {
                update.set("messages.$.messageReadTimestamp", status.getMessageReadTimestamp());
            }
            bulkOps.updateOne(query, update);
        });

        bulkOps.execute();
        redisTemplate.delete(statusKey);
    }

    private void updateMessagesWithStatuses(String chatId, List<Message> messages, List<MessageStatusPayloadDTO> statuses) {
        Map<LocalDateTime, MessageStatusPayloadDTO> statusMap = statuses.stream()
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

        persistMessagesToMongo(chatId, messages);
    }

    private void processGroupChatMessages() {
        Set<String> messageKeys = redisTemplate.keys(GROUP_MSG_NEW_KEY_PATTERN);
        Set<String> seenByKeys = redisTemplate.keys(GROUP_MSG_SEEN_BY_PATTERN);

        if ((messageKeys == null || messageKeys.isEmpty()) && (seenByKeys == null || seenByKeys.isEmpty())) {
            log.info("No group messages or seenBy found in Redis");
            return;
        }

        List<Future<?>> futures = new ArrayList<>();
        // process group messages in parallel
        if (messageKeys != null) {
            for (String messageKey : messageKeys) {
                futures.add(executorService.submit(() -> processSingleGroupChat(messageKey)));
            }
        }

        // process seenBy in parallel
        if (seenByKeys != null) {
            for (String seenByKey : seenByKeys) {
                futures.add(executorService.submit(() -> updateSeenByOnly(seenByKey)));
            }
        }
        waitForCompletion(futures);
    }

    private void processSingleGroupChat(String messageKey) {
        String groupId = extractChatId(messageKey);
        List<Message> messages = fetchMessagesFromRedis(messageKey);
        Map<LocalDateTime, List<String>> seenByMap = fetchSeenByFromRedis(groupId);

        if (messages.isEmpty()) {
            log.info("No messages found for group chat: {}", groupId);
            redisTemplate.delete(messageKey);
            return;
        }

        // Update messages with seenBy data before saving
        updateGroupMessagesBySeenby(groupId, messages, seenByMap);

        // Persist updated messages to MongoDB
        persistMessagesToMongo(groupId, messages);

        // Cleanup Redis keys
        redisTemplate.delete(messageKey);
        redisTemplate.delete("seenBy:" + groupId);
    }

    private void updateSeenByOnly(String seenByKey) {
        String groupId = extractChatId(seenByKey);

        // Fetch seenBy data from Redis
        Map<LocalDateTime, List<String>> seenByMap = fetchSeenByFromRedis(groupId);

        if (seenByMap.isEmpty()) {
            log.info("No seenBy data found for group: {}", groupId);
            redisTemplate.delete(seenByKey); // Cleanup Redis
            return;
        }

        log.info("Updating seenBy in MongoDB for group: {}", groupId);
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, Chat.class);

        // Iterate over seenBy entries and update MongoDB
        for (Map.Entry<LocalDateTime, List<String>> entry : seenByMap.entrySet()) {
            LocalDateTime messageTimestamp = entry.getKey();
            List<String> seenUsers = entry.getValue();

            Query query = Query.query(Criteria.where("_id").is(groupId)
                    .and("messages.sentTimestamp").is(messageTimestamp));

            Update update = new Update().addToSet("messages.$.seenBy", seenUsers);

            bulkOps.updateOne(query, update);
        }

        // Execute batch update
        bulkOps.execute();

        // Cleanup Redis after updating MongoDB
        redisTemplate.delete(seenByKey);
    }

    private void updateGroupMessagesBySeenby(String groupId, List<Message> messages, Map<LocalDateTime, List<String>> seenByMap) {
        for (Message message : messages) {
            LocalDateTime sentTimestamp = message.getSentTimestamp();

            // Check if there's seenBy data for this message timestamp
            if (seenByMap.containsKey(sentTimestamp)) {
                seenByMap.get(sentTimestamp).forEach(seenUser -> {
                    // Avoid duplicates in seenBy list
                    if (!message.getSeenBy().contains(seenUser)) {
                        message.getSeenBy().add((seenUser));
                    }
                });
            }
        }
    }

    private Map<LocalDateTime, List<String>> fetchSeenByFromRedis(String groupId) {
        HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();

        String seenKey = "seenBy:" + groupId;
        Map<Object, Object> redisData = hashOps.entries(seenKey);

        // Convert Redis response to Map<LocalDateTime, List<String>>
        Map<LocalDateTime, List<String>> seenByMap = new HashMap<>();
        for (Map.Entry<Object, Object> entry : redisData.entrySet()) {
            LocalDateTime timestamp = LocalDateTime.parse(entry.getKey().toString());
            List<String> users = Arrays.asList(entry.getValue().toString().split(",")); // Convert CSV string to List

            seenByMap.put(timestamp, users);
        }
        return seenByMap;
    }

    private List<Message> fetchMessagesFromRedis(String key) {
        List<Object> redisMessages = redisTemplate.opsForList().range(key, 0, -1);
        if (redisMessages == null || redisMessages.isEmpty()) return Collections.emptyList();
        return objectMapper.convertValue(redisMessages, new TypeReference<>() {
        });
    }

    private List<MessageStatusPayloadDTO> fetchStatusesFromRedis(String key) {
        List<Object> redisStatuses = redisTemplate.opsForList().range(key, 0, -1);
        if (redisStatuses == null || redisStatuses.isEmpty()) return Collections.emptyList();
        return objectMapper.convertValue(redisStatuses, new TypeReference<>() {
        });
    }

    private void persistMessagesToMongo(String chatId, List<Message> messages) {
        BulkOperations bulkOps = mongoTemplate.bulkOps(BulkOperations.BulkMode.ORDERED, Chat.class);
        messages.forEach(msg -> {
            Query query = Query.query(Criteria.where("_id").is(chatId));
            Update update = new Update().push("messages", msg);
            bulkOps.updateOne(query, update);
        });
        bulkOps.execute();
    }

    private String extractChatId(String key) {
        return key.substring(key.indexOf(":") + 1);
    }


    private void waitForCompletion(List<Future<?>> futures) {
        for (Future<?> future : futures) {
            try {
                future.get(); // Wait for each task to finish
            } catch (InterruptedException | ExecutionException e) {
                log.error("Error occurred while processing batch updates", e);
                Thread.currentThread().interrupt();
            }
        }
    }
}
