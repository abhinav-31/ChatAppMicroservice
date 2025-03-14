package com.chatapplication.chat_notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupMsgSendPayloadDTO {
    private String sender;
    private String content;
    private LocalDateTime sentTimestamp;
}
