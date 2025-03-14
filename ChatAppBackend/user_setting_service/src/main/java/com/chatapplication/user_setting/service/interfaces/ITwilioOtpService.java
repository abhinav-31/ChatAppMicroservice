package com.chatapplication.user_setting.service.interfaces;

public interface ITwilioOtpService {
    boolean sendOtp(String phoneNumber, Integer otp);
}
