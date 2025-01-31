package com.chatapplication.chat_notification.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeleteGroupInstByMemDTO {
    private String groupId;
    private String user;
}
