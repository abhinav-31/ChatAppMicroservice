package com.chatapplication.chat_notification.controller;

import com.chatapplication.chat_notification.dto.GroupStatusPayloadDTO;
import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.dto.MessageStatusPayloadDTO;
import com.chatapplication.chat_notification.service.interfaces.IMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    @Autowired
    private IMessageService messageService;

    @MessageMapping("/group-chat")
    public void sendMessage(@Payload MessageDTO message) {
        messageService.sendGroupMessage(message);
    }

    @MessageMapping("/status")
    public void messageStatus(@Payload MessageStatusPayloadDTO messageStatusPayloadDTO) {
        messageService.updateMessageStatus(messageStatusPayloadDTO);
    }

    @MessageMapping("/seenBy")
    public void messageSeen(@Payload GroupStatusPayloadDTO groupStatusPayloadDTO) {
        messageService.updateGroupMessageSeenBy(groupStatusPayloadDTO);
    }
}
