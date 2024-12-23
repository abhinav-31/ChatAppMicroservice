package com.chatapplication.user_setting.dto;


import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequestDTO {

    @Email(message = "Enter valid email")
    @NotNull(message = "Email cannot be null")
    private String email;

    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(regexp = "^\\+91\\d{10}$")
    private String phoneNumber;
}
