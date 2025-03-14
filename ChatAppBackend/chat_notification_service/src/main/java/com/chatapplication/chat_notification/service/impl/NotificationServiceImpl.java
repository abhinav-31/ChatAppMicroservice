package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.GroupAddNotificationPayloadDTO;
import com.chatapplication.chat_notification.repository.GroupChatRepository;
import com.chatapplication.chat_notification.service.interfaces.INotificationService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationServiceImpl implements INotificationService {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private GroupChatRepository groupChatRepository;

    @Override
    public void sendNotificationToGroupMembers(GroupAddNotificationPayloadDTO groupAddNotificationPayloadDTO) {
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.MEM_ADD_NOTIFICATION_ROUTING_KEY, groupAddNotificationPayloadDTO);
    }
}
