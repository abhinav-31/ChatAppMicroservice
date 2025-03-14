package com.chatapplication.chat_notification.repository;

import com.chatapplication.chat_notification.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PrivateChatRepository extends MongoRepository<Chat, String> {
    Optional<Chat> findByChatId(String chatId);

    @Query("{ 'members' : ?0}")
    Optional<List<Chat>> findByMember(String senderId);
}
