package com.chatapplication.chat_notification.entity;

import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

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
    private LocalDateTime timestamp;         // Timestamp when the message was sent
    private String status;                   // Status of the message (sent, read, delivered)
    private boolean deleted;                 // If the message is deleted for a specific user
}
