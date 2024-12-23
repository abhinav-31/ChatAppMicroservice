package com.chatapplication.user_setting.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaveUserReqDTO {
    @NotNull(message = "Username must not be null")
    @Size(min = 1, max = 10, message = "Please enter a username")
    private String username;
    private String about;
    private String profilePicture;
}
