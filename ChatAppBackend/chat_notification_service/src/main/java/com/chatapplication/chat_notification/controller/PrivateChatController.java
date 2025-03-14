package com.chatapplication.chat_notification.controller;

import com.chatapplication.chat_notification.dto.PrivateChatDeleteReqDTO;
import com.chatapplication.chat_notification.dto.PrivateChatMsgSendReqDTO;
import com.chatapplication.chat_notification.dto.UpdatePrivateChatMessageReqDTO;
import com.chatapplication.chat_notification.service.interfaces.IPrivateChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/private-chat")
public class PrivateChatController {

    @Autowired
    private IPrivateChatService privateChatService;

    // @PostMapping("/create-or-send")
    @MessageMapping("/chat-app")
    public void createOrSendMessage(@RequestBody PrivateChatMsgSendReqDTO privateChatReqDTO) {
        privateChatService.sendMessage(privateChatReqDTO);
    }

    // delete chat for one user
    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePrivateChat(@RequestBody PrivateChatDeleteReqDTO privateChatDeleteReqDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(privateChatService.deleteChat(privateChatDeleteReqDTO.getChatId(), privateChatDeleteReqDTO.getUserId()));
    }

    // update message status
    @PatchMapping("/update/message-status")
    public ResponseEntity<?> updateMessageStatus(@RequestBody UpdatePrivateChatMessageReqDTO updateReq) {
        LocalDateTime timestamp = LocalDateTime.parse(updateReq.getMessageTimeStamp());
        return ResponseEntity.status(HttpStatus.OK).body(privateChatService.updateMessageStatus(updateReq.getChatId(), timestamp, updateReq.getStatus()));
    }

    // get private chat
    @GetMapping("/{senderId}")
    public ResponseEntity<?> getPrivateChat(@PathVariable String senderId) {
        return ResponseEntity.status(HttpStatus.OK).body(privateChatService.getPrivateChat(senderId));
    }

    // Get chatId
    @GetMapping("/chatId/{senderId}/{receiverId}")
    public ResponseEntity<?> getChatId(@PathVariable String senderId, @PathVariable String receiverId) {
        return ResponseEntity.status(HttpStatus.OK).body(privateChatService.generateChatId(senderId, receiverId));
    }
}


