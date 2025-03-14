package com.chatapplication.chat_notification.entity;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    private String sender;                   // Sender of the message
    private String receiver;                 // Receiver of the message (null for group chat)
    private String content;                  // Content of the message
    private String status;                   // Status of the message (sent, read, delivered)
    private LocalDateTime sentTimestamp;     
    private LocalDateTime messageDeliveredTimestamp;
    private LocalDateTime messageReadTimestamp;
    private List<String> seenBy;             // for group message
}
