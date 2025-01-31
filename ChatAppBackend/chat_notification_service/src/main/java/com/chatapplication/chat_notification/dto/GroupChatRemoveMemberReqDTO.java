package com.chatapplication.chat_notification.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupChatRemoveMemberReqDTO {
    private List<String> groupMembers;
    private String groupId;
}
