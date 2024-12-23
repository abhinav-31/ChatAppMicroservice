package com.chatapplication.user_setting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenerateOtpResponseDTO {
    private String message;
    private boolean success;
    private String data;
}
