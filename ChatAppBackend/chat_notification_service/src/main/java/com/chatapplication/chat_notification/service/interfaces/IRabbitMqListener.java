package com.chatapplication.chat_notification.service.interfaces;

import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.dto.PrivateChatResDTO;

import java.util.List;


public interface IRabbitMqListener {
    void listenMessage(PrivateChatResDTO response);
    void listenNotification(String... users);
    void listenGroupMessage(MessageDTO messageDTO);
    void listenMemAdd(List<String> users);
}
