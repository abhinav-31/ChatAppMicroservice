package com.chatapplication.user_setting.scheduler;

import com.chatapplication.user_setting.util.RedisUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class OtpScheduler {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    public void checkOtpExipration(){
        Set<String> keys = redisTemplate.keys("otpTimestamp:*");
        if(keys!=null){
            for(String key : keys){
                Long otpTimeStamp = (Long) redisTemplate.opsForValue().get(key);
                if(otpTimeStamp != null && System.currentTimeMillis()- otpTimeStamp > TimeUnit.DAYS.toMillis(2)){
                    String phoneNumber = key.split (":")[1];

                    // check if the user has any OTPs generated but not verified
                    String otpKey = "otp:"+phoneNumber;
                    if(redisTemplate.hasKey(otpKey)){
                        log.info("User with phoneNumber:"+phoneNumber+" for 30 days");
                        RedisUtils.blockUserIndefinitely(phoneNumber,"You are blocked for indefinite period for generating OTP but not verified",30,redisTemplate);
                    }

                    // cleanup expired keys
                    redisTemplate.delete(key);
                }
            }
        }
    }
}
