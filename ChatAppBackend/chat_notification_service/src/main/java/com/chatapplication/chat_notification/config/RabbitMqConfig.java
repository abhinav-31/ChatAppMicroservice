package com.chatapplication.chat_notification.config;

import com.chatapplication.chat_notification.service.interfaces.IRabbitMqListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Slf4j
@Configuration
public class RabbitMqConfig {

    // Define Constants
    public static final String EXCHANGE = "chat-exchange";

    public static final String MESSAGE_QUEUE = "chat-message-queue";
    public static final String MESSAGE_ROUTING_KEY = "chat.message";

    public static final String JOIN_REQ_NOTIFICATION_QUEUE = "chat-notification-queue";
    public static final String JOIN_REQ_NOTIFICATION_ROUTING_KEY = "chat.notification";

    public static final String GROUP_MESSAGE_QUEUE = "chat-group-message-queue";
    public static final String GROUP_MESSAGE_ROUTING_KEY = "chat-group-message";

    public static final String MEM_ADD_NOTIFICATION_QUEUE = "chat-mem-add-notification-queue";
    public static final String MEM_ADD_NOTIFICATION_ROUTING_KEY = "chat-mem-add-notification";


    // Topic
    @Bean
    public TopicExchange exchange(){
        return new TopicExchange(EXCHANGE);
    }

    // Queues
    @Bean
    public Queue messageQueue(){
        return new Queue(MESSAGE_QUEUE);
    }

    @Bean
    public Queue joinReqNotificationQueue(){
        return new Queue(JOIN_REQ_NOTIFICATION_QUEUE);
    }

    @Bean
    public Queue groupMessageQueue(){
        return new Queue(GROUP_MESSAGE_QUEUE);
    }

    @Bean
    public Queue memAddNotificationQueue(){
        return new Queue(MEM_ADD_NOTIFICATION_QUEUE);
    }

    // Bindings : binding queue to exchange with routing key;
    @Bean
    public Binding messageBinding(){

        return BindingBuilder.bind(messageQueue()).to(exchange()).with(MESSAGE_ROUTING_KEY);
    }

    @Bean
    public Binding notificationBinding(){
        return BindingBuilder.bind(joinReqNotificationQueue()).to(exchange()).with(JOIN_REQ_NOTIFICATION_ROUTING_KEY);
    }

    @Bean
    public Binding groupMessageBinding(){
        return BindingBuilder.bind(groupMessageQueue()).to(exchange()).with(GROUP_MESSAGE_ROUTING_KEY);
    }

    @Bean
    public Binding memAddNotificationBinding(){
        return BindingBuilder.bind(memAddNotificationQueue()).to(exchange()).with(MEM_ADD_NOTIFICATION_ROUTING_KEY);
    }

    // Jackson2JsonMessageConverter for JSON serialization
    @Bean
    public MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }

    // RabbitTemplate using the Jackson2JsonMessageConverter
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter){
        log.info("MessageConverter: {}",messageConverter);
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter);  // Set the Jackson message converter
        return rabbitTemplate;
    }




    @Bean
    public MessageListenerAdapter listenerAdapter(IRabbitMqListener receiver) {
        log.info("listenerAdapter {}",receiver);
        return new MessageListenerAdapter(receiver, "listenMessage");
    }
    // Message Listener container
//    @Bean
//    public SimpleMessageListenerContainer container(ConnectionFactory connectionFactory, MessageListenerAdapter listenerAdapter){
//        log.info("ListenerAdapter: {}",listenerAdapter);
//        // SimpleMessageListenerContainer
//        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
//        // set connection factory
//        container.setConnectionFactory(connectionFactory);
//        // set Queue Names
//        container.setQueueNames(MESSAGE_QUEUE,NOTIFICATION_QUEUE);
//        // set Message Listener
//        container.setMessageListener(listenerAdapter);
//        // return SimpleMessageListenerContainer
//        return container;
//    }
}
