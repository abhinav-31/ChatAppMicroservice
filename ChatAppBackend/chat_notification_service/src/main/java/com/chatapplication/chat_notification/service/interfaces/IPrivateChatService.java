package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.GetPrivateChatResDTO;
import com.chatapplication.chat_notification.dto.PrivateChatMsgSendReqDTO;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IPrivateChatService {
    // Methods for Private Chat
    CompletableFuture<Void> sendMessage(PrivateChatMsgSendReqDTO privateChatMsgSendReqDTO);

    String deleteChat(String chatId, String userId);

    String updateMessageStatus(String chatId, LocalDateTime timeStamp, String status);

    List<GetPrivateChatResDTO> getPrivateChat(String chatId);

    // default method
    default String generateChatId(String sender, String receiver) {
        List<String> participants = Arrays.asList(sender.substring(0, 14), receiver.substring(0, 14));
        Collections.sort(participants);
        return String.join("-", participants);
    }
}