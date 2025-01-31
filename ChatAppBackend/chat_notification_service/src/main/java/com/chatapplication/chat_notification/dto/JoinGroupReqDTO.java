package com.chatapplication.chat_notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JoinGroupReqDTO {
    private String user;
    private String groupId;
}
