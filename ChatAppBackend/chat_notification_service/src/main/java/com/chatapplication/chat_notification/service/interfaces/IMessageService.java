package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.entity.Chat;

public interface IMessageService {
    void sendMessage(MessageDTO message);
    Chat getGroupMessageForChat(String groupId);
}
