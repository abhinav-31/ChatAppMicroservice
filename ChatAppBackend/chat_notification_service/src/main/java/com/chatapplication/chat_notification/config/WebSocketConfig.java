package com.chatapplication.chat_notification.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")  // WebSocket connection endpoint
                .setAllowedOrigins("http://localhost:5173")      // allowing any origins
                .withSockJS();               // WebSocket will fallback to SockJS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableStompBrokerRelay("/topic","/queue")
                .setRelayHost("localhost")
                .setRelayPort(61613)             // Default port for STOMP protocol in RabbitMq
                .setClientLogin("guest")         // Default RabbitMq User
                .setClientPasscode("guest");     // Default RabbitMq Password
        registry.setApplicationDestinationPrefixes("/app");
    }
}
