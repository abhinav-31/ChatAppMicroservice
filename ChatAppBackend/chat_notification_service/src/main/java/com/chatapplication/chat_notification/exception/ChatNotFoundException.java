package com.chatapplication.chat_notification.exception;

public class ChatNotFoundException extends RuntimeException {
    private String message;
    public ChatNotFoundException(String message) {
        super(message);
    }
}
