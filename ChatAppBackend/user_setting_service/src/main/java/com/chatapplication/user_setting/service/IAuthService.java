package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.GenerateOtpResponseDTO;
import com.chatapplication.user_setting.dto.LoginRequestDTO;
import com.chatapplication.user_setting.dto.SignUpRequestDTO;

public interface IAuthService {
    GenerateOtpResponseDTO signUpUser(SignUpRequestDTO signUpRequestDTO);
    GenerateOtpResponseDTO userLogin(LoginRequestDTO loginRequestDTO);
}
