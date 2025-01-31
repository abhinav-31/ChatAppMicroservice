package com.chatapplication.chat_notification.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatCreateResDTO {
    private String groupChatId;
    private String admin;
    private String groupName;
}
