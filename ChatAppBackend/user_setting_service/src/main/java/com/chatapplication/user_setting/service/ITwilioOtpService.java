package com.chatapplication.user_setting.service;

public interface ITwilioOtpService {
    boolean sendOtp(String phoneNumber, Integer otp);
}
