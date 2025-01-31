package com.chatapplication.chat_notification.repository;

import com.chatapplication.chat_notification.entity.Chat;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GroupChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByChatId(String groupChatId);
}
