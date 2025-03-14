package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.GroupStatusPayloadDTO;
import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.dto.MessageStatusPayloadDTO;
import com.chatapplication.chat_notification.entity.Chat;

public interface IMessageService {
    void sendGroupMessage(MessageDTO message);

    Chat getGroupMessageForChat(String groupId);

    void updateMessageStatus(MessageStatusPayloadDTO messageStatusPayloadDTO);

    void updateGroupMessageSeenBy(GroupStatusPayloadDTO groupMessageStatusPayloadDTO);
}
