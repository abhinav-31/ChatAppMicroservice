package com.chatapplication.chat_notification.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
        .setAllowedOrigins("http://192.168.1.2:5173")
                .withSockJS()
                .setHeartbeatTime(10000)
                .setDisconnectDelay(30000);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableStompBrokerRelay("/topic", "/queue")
                .setRelayHost("rabbitmq")
                .setRelayPort(61613)             // Default port for STOMP protocol in RabbitMq
                .setClientLogin("guest")         // Default RabbitMq User
                .setClientPasscode("guest")      // Default RabbitMq Password
                .setSystemHeartbeatReceiveInterval(10000)
                .setSystemHeartbeatSendInterval(10000);
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration webSocketTransportRegistration){
        webSocketTransportRegistration
                .setSendTimeLimit(15*1000)
                .setSendBufferSizeLimit(512*1024)
                .setMessageSizeLimit(128*1024);
    }
}
