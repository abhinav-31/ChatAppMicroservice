package com.chatapplication.chat_notification.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String userId;
    private List<UnreadPrivate> unreadPrivate;
    private List<UnreadGroup> unreadGroup;

    @Getter
    @Setter
    public static class UnreadPrivate {
        private String chatId;
        private int count;
    }

    @Getter
    @Setter
    public static class UnreadGroup {
        private String groupId;
        private int count;
    }
}