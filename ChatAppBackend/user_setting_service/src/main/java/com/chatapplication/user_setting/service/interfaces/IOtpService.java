package com.chatapplication.user_setting.service.interfaces;

import com.chatapplication.user_setting.dto.OtpVerificationResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.util.Pair;

public interface IOtpService {
    Pair<String, Boolean> generateOtp(String phoneNumber, String uuid, String context);

    OtpVerificationResponse verifyOtp(String otp, HttpServletRequest request, String context);
}
