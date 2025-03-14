package com.chatapplication.chat_notification.controller;


import com.chatapplication.chat_notification.dto.GroupAddNotificationPayloadDTO;
import com.chatapplication.chat_notification.service.interfaces.INotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;

public class NotificationController {

    @Autowired
    private INotificationService notificationService;

    @MessageMapping("/group-add")
    public void sendNotificationToGroupMembers(@Payload GroupAddNotificationPayloadDTO groupAddNotificationPayloadDTO) {
        notificationService.sendNotificationToGroupMembers(groupAddNotificationPayloadDTO);
    }
}
