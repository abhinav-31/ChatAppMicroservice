package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.config.TwilioConfig;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TwilioOtpServiceImpl implements ITwilioOtpService {
    @Autowired
    private TwilioConfig twilioConfig;
    @Override
    public boolean sendOtp(String phoneNumber, Integer otp) {

        try{
            PhoneNumber to = new PhoneNumber(phoneNumber);
            PhoneNumber from = new PhoneNumber(twilioConfig.getPhoneNumber());
            String sendMessage = "Dear Customer, Your OTP is **" + otp + "**" + "Please use this to verify and proceed further.";
            Message message = Message
                    .creator(to, // to
                            from, // from
                            sendMessage)
                    .create();
            log.info("Message sent info: {}",message.getBody());
            return true;
        }catch(Exception e){
            log.error("Error in sending OTP: {}",e.getMessage());
            return false;
        }

    }
}
