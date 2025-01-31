package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.entity.Chat;

import java.time.LocalDateTime;

public interface IPrivateChatService {
    // Methods for Private Chat
    Chat sendMessage(String sender, String receiver, String content);
    String deleteChat(String chatId, String userId);
    String updateMessageStatus(String chatId, LocalDateTime timeStamp, String status);
    Chat getPrivateChat(String chatId);
}