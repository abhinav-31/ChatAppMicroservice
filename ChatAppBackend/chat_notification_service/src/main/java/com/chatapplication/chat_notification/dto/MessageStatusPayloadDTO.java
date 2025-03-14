package com.chatapplication.chat_notification.dto;


import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageStatusPayloadDTO {
    private String chatId;
    private String sender;
    private String status;
    private LocalDateTime sentTimestamp;
    private LocalDateTime messageDeliveredTimestamp;
    private LocalDateTime messageReadTimestamp;
}
