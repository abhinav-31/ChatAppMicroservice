package com.chatapplication.chat_notification.repository;

import com.chatapplication.chat_notification.entity.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PrivateChatRepository extends MongoRepository<Chat,String> {
//    List<Chat> findByMembersContainingAndDeletedForNot(String userId, boolean deleted);
//    Optional<Chat> findByMembers(List<String> members);

    Optional<Chat> findByChatId(String chatId);
}
