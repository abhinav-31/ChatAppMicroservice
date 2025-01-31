package com.chatapplication.chat_notification.controller;

import com.chatapplication.chat_notification.dto.PrivateChatDeleteReqDTO;
import com.chatapplication.chat_notification.dto.PrivateChatReqDTO;
import com.chatapplication.chat_notification.dto.UpdatePrivateChatMessageReqDTO;
import com.chatapplication.chat_notification.service.interfaces.IPrivateChatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@CrossOrigin
@RequestMapping("/private-chat")
public class PrivateChatController {

    @Autowired
    private IPrivateChatService chatService;

    // @PostMapping("/create-or-send")
    @MessageMapping("/chat-app")
    public void createOrSendMessage(@RequestBody PrivateChatReqDTO privateChatReqDTO) {
        String sender = privateChatReqDTO.getParticipants().get(0);
        String receiver = privateChatReqDTO.getParticipants().get(1);
        chatService.sendMessage(sender, receiver, privateChatReqDTO.getMessage());
    }

    // delete chat for one user
    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePrivateChat(@RequestBody PrivateChatDeleteReqDTO privateChatDeleteReqDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(chatService.deleteChat(privateChatDeleteReqDTO.getChatId(), privateChatDeleteReqDTO.getUserId()));
    }

    // update message status
    @PatchMapping("/update/message-status")
    public ResponseEntity<?> updateMessageStatus(@RequestBody UpdatePrivateChatMessageReqDTO updateReq) {
        LocalDateTime timestamp = LocalDateTime.parse(updateReq.getMessageTimeStamp());
        return ResponseEntity.status(HttpStatus.OK).body(chatService.updateMessageStatus(updateReq.getChatId(), timestamp, updateReq.getStatus()));
    }

    // get private chat
    @GetMapping("/private-chat/{chatId}")
    public ResponseEntity<?> getPrivateChat(@PathVariable String chatId) {  // chatId: sender-receiver
        return ResponseEntity.status(HttpStatus.FOUND).body(chatService.getPrivateChat(chatId));
    }
}


