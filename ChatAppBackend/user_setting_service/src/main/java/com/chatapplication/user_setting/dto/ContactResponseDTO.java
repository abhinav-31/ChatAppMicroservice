package com.chatapplication.user_setting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponseDTO {
    private String username;
    private String phoneNumber;
    private String about;
    private String profilePhoto;
}
