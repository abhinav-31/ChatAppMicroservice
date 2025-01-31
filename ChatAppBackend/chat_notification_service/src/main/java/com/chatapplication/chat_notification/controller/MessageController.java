package com.chatapplication.chat_notification.controller;

import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.service.interfaces.IMessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {
    @Autowired
    private IMessageService messageService;

    @MessageMapping("/send")
    public void sendMessage(@Payload MessageDTO message) {
        messageService.sendMessage(message);
    }
//
//    @GetMapping("/chat/{chatId}")
//    public ResponseEntity<?> getMessages(@PathVariable String chatId) {
//        return ResponseEntity.status(HttpStatus.OK).body(messageService.getMessageForChat(chatId));
//    }
}
