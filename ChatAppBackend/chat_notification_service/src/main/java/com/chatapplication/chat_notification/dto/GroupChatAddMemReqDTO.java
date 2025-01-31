package com.chatapplication.chat_notification.dto;

import lombok.*;

import java.util.List;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatAddMemReqDTO {
    private List<String> groupMembers;
    private String groupId;
}
