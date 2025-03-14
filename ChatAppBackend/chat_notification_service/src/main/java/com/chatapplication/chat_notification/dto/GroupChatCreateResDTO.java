package com.chatapplication.chat_notification.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatCreateResDTO {
    private String groupId;
    private String admin;
    private String groupName;
    private List<String> groupMembers;
}
