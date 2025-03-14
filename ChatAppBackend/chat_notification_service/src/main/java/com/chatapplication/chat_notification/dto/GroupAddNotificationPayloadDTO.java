package com.chatapplication.chat_notification.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupAddNotificationPayloadDTO {
    private String groupId;
    private String groupName;
    private String groupAdmin;
    private List<String> groupMembers;
}
