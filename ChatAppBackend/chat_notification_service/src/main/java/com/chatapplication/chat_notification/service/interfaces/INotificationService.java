package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.GroupAddNotificationPayloadDTO;

public interface INotificationService {
    void sendNotificationToGroupMembers(GroupAddNotificationPayloadDTO groupAddNotificationPayloadDTO);
}
