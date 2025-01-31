package com.chatapplication.chat_notification.repository;

import com.chatapplication.chat_notification.entity.Notification;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification,String> {
}
