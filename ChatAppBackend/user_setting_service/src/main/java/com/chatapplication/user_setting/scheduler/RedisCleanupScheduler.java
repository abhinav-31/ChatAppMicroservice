package com.chatapplication.user_setting.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Slf4j
public class RedisCleanupScheduler {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000) // Run daily
    public void cleanupExpiredKeys() {
        log.info("Running Redis cleanup task...");

        // Define the pattern for keys to clean up
        Set<String> otpKeys = redisTemplate.keys("otp:*");
        Set<String> maxGenerateKeys = redisTemplate.keys("maxGenerate:*");

        // Cleanup OTP keys
        if (otpKeys != null && !otpKeys.isEmpty()) {
            redisTemplate.delete(otpKeys);
            log.info("Deleted stale OTP keys: {}", otpKeys);
        }

// Cleanup maxGenerate keys
        if (maxGenerateKeys != null && !maxGenerateKeys.isEmpty()) {
            redisTemplate.delete(maxGenerateKeys);
            log.info("Deleted stale maxGenerate keys: {}", maxGenerateKeys);
        }

        log.info("Redis cleanup task completed.");
    }
}
