package com.chatapplication.user_setting.util;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.concurrent.TimeUnit;

@UtilityClass
@Slf4j
public class RedisUtils {

    // check user block
    public void checkUserBlocked(String phoneNumber,RedisTemplate<String, Object> redisTemplate){
        String blockKey = "block:"+phoneNumber;
        Long block = (Long) redisTemplate.opsForValue().get(blockKey);
        if(block != null){
            throw new RuntimeException("You are temporarily blocked, Please try again later");
        }

        String indefiniteBlockKey = "indefiniteBlock:" + phoneNumber;
        String indefiniteBlock = (String)redisTemplate.opsForValue().get(indefiniteBlockKey);
        log.debug("IndefiniteBlock: {}" ,indefiniteBlock);
        if(indefiniteBlock != null){
            throw new RuntimeException("You are blocked for indefinite period, Please use different phone number");
        }
    }

    // block user indefinitely
    public void blockUserIndefinitely(String phoneNumber, String message,int INDEFINITE_BLOCK,RedisTemplate<String, Object> redisTemplate){
        String indefiniteBlockKey = "indefiniteBlock:" + phoneNumber;
        redisTemplate.opsForValue().set(indefiniteBlockKey,message,INDEFINITE_BLOCK, TimeUnit.DAYS);
        throw new RuntimeException("You are blocked for indefinite period, Please use different phone number");
    }
}
