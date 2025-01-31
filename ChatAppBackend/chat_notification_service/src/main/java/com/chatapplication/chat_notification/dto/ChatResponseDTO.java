package com.chatapplication.chat_notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {
    private String groupName;
    private String admin;
    private List<String> members;
    private List<MessageDTO> messages;
}