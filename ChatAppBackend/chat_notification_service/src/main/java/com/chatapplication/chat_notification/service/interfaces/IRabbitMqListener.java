package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.GroupAddNotificationPayloadDTO;
import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.dto.PrivateChatMsgSendResDTO;


public interface IRabbitMqListener {
    void listenMessage(PrivateChatMsgSendResDTO response);

    void listenNotification(String... users);

    void listenGroupMessage(MessageDTO messageDTO);

    void listenMemAdd(GroupAddNotificationPayloadDTO groupAddNotificationPayloadDTO);
}
