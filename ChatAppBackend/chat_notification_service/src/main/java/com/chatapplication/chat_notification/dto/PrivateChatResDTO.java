package com.chatapplication.chat_notification.dto;

import com.chatapplication.chat_notification.entity.Message;

import lombok.*;

@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrivateChatResDTO {
    private String chatId;
    private Message message;
}
