package com.chatapplication.chat_notification.service.impl;

import com.chatapplication.chat_notification.config.RabbitMqConfig;
import com.chatapplication.chat_notification.dto.MessageDTO;
import com.chatapplication.chat_notification.dto.PrivateChatResDTO;
import com.chatapplication.chat_notification.service.interfaces.IRabbitMqListener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class RabbitMqListenerImpl implements IRabbitMqListener {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    @RabbitListener(queues = RabbitMqConfig.MESSAGE_QUEUE)
    public void listenMessage(PrivateChatResDTO response) {
        String destination = "/queue/"+response.getMessage().getReceiver();   // for private messaging
        log.info("Topic : {}",destination);
        // Send the message to the receiver
        simpMessagingTemplate.convertAndSend(destination, response);
    }

    @Override
    @RabbitListener(queues = RabbitMqConfig.JOIN_REQ_NOTIFICATION_QUEUE)
    public void listenNotification(String... users){
        String destination = "/queue/"+users[0];
        simpMessagingTemplate.convertAndSend(destination,users[1]);
    }

    @Override
    @RabbitListener(queues = RabbitMqConfig.GROUP_MESSAGE_QUEUE)
    public void listenGroupMessage(MessageDTO messageDTO){
        String destination = "/topic/group"+messageDTO.getGroupId();
        String[] payload = {messageDTO.getSender(),messageDTO.getContent()};
        simpMessagingTemplate.convertAndSend(destination,payload);
    }

    @Override
    @RabbitListener(queues = RabbitMqConfig.MEM_ADD_NOTIFICATION_QUEUE)
    public void listenMemAdd(List<String> users){
        String payload = "You are added to the new group";
        for(String user : users){
            String destination = "/queue/"+user;
            simpMessagingTemplate.convertAndSend(destination,payload);
        }
    }
}

