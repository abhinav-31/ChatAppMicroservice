package com.chatapplication.chat_notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PrivateChatMsgSendReqDTO {
    private List<String> participants;
    private String message;
    private LocalDateTime sentTimestamp;
}
