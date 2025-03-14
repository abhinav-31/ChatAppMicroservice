package com.chatapplication.chat_notification.dto;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupStatusPayloadDTO {
    private String groupId;
    private String userId;
    private LocalDateTime sentTimestamp;
}
