package com.chatapplication.user_setting.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerifyRequestDTO {
    @NotNull(message = "OTP cannot be null")
    @Size(min = 6, max = 6, message = "OTP must be 6 digits")
    private String otp;
    @NotNull(message = "Please send context also(signup,login")
    private String context;
}
