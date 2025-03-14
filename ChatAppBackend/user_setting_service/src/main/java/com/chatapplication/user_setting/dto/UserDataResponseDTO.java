package com.chatapplication.user_setting.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDataResponseDTO {
    String username;
    String about;
    String profilePhoto;
    String senderId;
    LocalDateTime lastSeen;
}
