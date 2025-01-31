package com.chatapplication.chat_notification.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chats")
public class Chat {
    @Id
    private String chatId;                                      // chatId for PrivateChat & groupId for GroupChat
    private String groupName;                                   // null for private chat & not null for group chat
    private String admin;                                       // null for private chat & not null for group chat
    private List<String> members;                               // 2 members for private chat & 1 or more for group chat
    private List<Message> messages;                             // Messages in the chat
    private LocalDateTime timestamp;                            // Timestamp for the chat creation
    private Map<String, Boolean> deletedFor;                    // Key: userId, Value: true if deleted for the user -> for private chat
    private Map<String, LocalDateTime> lastSeenMessageTimestamp; // Last seen message timestamp for each user
}
