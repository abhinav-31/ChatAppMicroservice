package com.chatapplication.chat_notification.dto;

import com.chatapplication.chat_notification.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetPrivateChatResDTO {
    private String chatId;
    private List<String> members;
    private List<Message> privateMessages;
    private List<Message> unreadMessages;
}
