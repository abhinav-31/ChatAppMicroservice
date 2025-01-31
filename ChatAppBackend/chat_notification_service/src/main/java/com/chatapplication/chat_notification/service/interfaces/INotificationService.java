package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.JoinGroupReqDTO;

public interface INotificationService {
    void sendNotificationToAdmin(JoinGroupReqDTO notification);
}
