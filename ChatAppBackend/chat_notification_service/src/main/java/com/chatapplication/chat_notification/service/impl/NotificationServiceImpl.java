package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.JoinGroupReqDTO;
import com.chatapplication.chat_notification.entity.Chat;
import com.chatapplication.chat_notification.exception.ChatNotFoundException;
import com.chatapplication.chat_notification.repository.GroupChatRepository;
import com.chatapplication.chat_notification.service.interfaces.INotificationService;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements INotificationService {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    @Autowired
    private GroupChatRepository groupChatRepository;

    @Override
    public void sendNotificationToAdmin(JoinGroupReqDTO joinGroupReqDTO) {
        // first get the chat and from chat get the admin
        Chat group = groupChatRepository.findByChatId(joinGroupReqDTO.getGroupId()).orElseThrow(() -> new ChatNotFoundException("Group is not found"));
        // get the group admin
        String admin = group.getAdmin();
        // get the user
        String user = joinGroupReqDTO.getUser();
        // send the notification to the admin that user want to join the group
        String[] users = {admin,user};
        rabbitTemplate.convertAndSend(RabbitMqConfig.EXCHANGE, RabbitMqConfig.JOIN_REQ_NOTIFICATION_ROUTING_KEY, users);
    }
}
