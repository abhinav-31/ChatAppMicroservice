package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.*;
import com.chatapplication.chat_notification.service.interfaces.IRabbitMqListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
public class RabbitMqListenerImpl implements IRabbitMqListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    @RabbitListener(queues = RabbitMqConfig.MESSAGE_QUEUE)
    public void listenMessage(PrivateChatMsgSendResDTO response) {
        String destination = "/queue/" + response.getMessage().getReceiver();   // for private messaging
        log.info("Topic : {}", destination);
        // Send the message to the receiver
        simpMessagingTemplate.convertAndSend(destination, response);
    }

    @Override
    @RabbitListener(queues = RabbitMqConfig.JOIN_REQ_NOTIFICATION_QUEUE)
    public void listenNotification(String... users) {
        String destination = "/queue/" + users[0];
        simpMessagingTemplate.convertAndSend(destination, users[1]);
    }

    @Override
    @RabbitListener(queues = RabbitMqConfig.GROUP_MESSAGE_QUEUE)
    public void listenGroupMessage(MessageDTO messageDTO) {
        String destination = "/topic/group-" + messageDTO.getGroupId();
        GroupMsgSendPayloadDTO payload = GroupMsgSendPayloadDTO.builder()
                .sender(messageDTO.getSender())
                .content(messageDTO.getContent())
                .sentTimestamp(messageDTO.getSentTimestamp())
                .build();
        simpMessagingTemplate.convertAndSend(destination, payload);
    }

    @Override
    @RabbitListener(queues = RabbitMqConfig.MEM_ADD_NOTIFICATION_QUEUE)
    public void listenMemAdd(GroupAddNotificationPayloadDTO groupAddNotificationPayloadDTO) {
        List<String> groupMembers = groupAddNotificationPayloadDTO.getGroupMembers();
        for (String groupMember : groupMembers) {
            String destination = "/queue/group-add-" + groupMember;
            simpMessagingTemplate.convertAndSend(destination, groupAddNotificationPayloadDTO);
        }
    }

    @RabbitListener(queues = RabbitMqConfig.UPDATE_STATUS_QUEUE)
    public void listenUpdateStatus(MessageStatusPayloadDTO messageStatusPayloadDTO) {
        StringBuilder destination = new StringBuilder("/queue/status-");
        if (messageStatusPayloadDTO.getStatus().equals("read")) {
            destination.append("read-" + messageStatusPayloadDTO.getSender());
        } else if (messageStatusPayloadDTO.getStatus().equals("delivered")) {
            destination.append("delivered-" + messageStatusPayloadDTO.getSender());
        }
        simpMessagingTemplate.convertAndSend(destination.toString(), messageStatusPayloadDTO);
    }
}

