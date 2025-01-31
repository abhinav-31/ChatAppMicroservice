package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.OtpVerificationResponse;
import com.chatapplication.user_setting.dto.OtpVerifyRequestDTO;
import com.chatapplication.user_setting.dto.SignUpRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.util.Pair;

public interface IOtpService {
    Pair<String,Boolean> generateOtp(String phoneNumber, String uuid, String context);
    OtpVerificationResponse verifyOtp(String otp, HttpServletRequest request, String context);
}
