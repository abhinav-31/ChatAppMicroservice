package com.chatapplication.chat_notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PrivateChatReqDTO {
    private List<String> participants;
    private String message;
}
