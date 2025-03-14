package com.chatapplication.chat_notification.dto;

import com.chatapplication.chat_notification.entity.Message;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetGroupChatResDTO {
    private String groupId;
    private String groupName;
    private String groupAdmin;
    private List<String> groupMembers;
    private List<Message> groupMessages;
    private List<Message> unreadGroupMessages;
}
