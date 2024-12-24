package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.OtpVerificationResponse;
import com.chatapplication.user_setting.dto.OtpVerifyRequestDTO;
import com.chatapplication.user_setting.exception.UserBlockedException;
import com.chatapplication.user_setting.util.CookieUtils;
import com.chatapplication.user_setting.util.RedisUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.util.Pair;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Map;

import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
public class OtpServiceImpl implements IOtpService {
    //    private static final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ITwilioOtpService twilioOtpService;
    private static final int OTP_TTL_MINUTE = 3;
    private static final int MAX_ATTEMPTS = 3;
    private static final int BLOCKED_TIME = 5; // For wrong input
    private static final int MAX_OTP_GENERATION = 2; // 2 Times a particular user can generate otp after that a new number have to be used
    private static final int INDEFINITE_BLOCK = 30;  // 30 days (if user never came back)

    @Override
    public Pair<String, Boolean> generateOtp(String phoneNumber, String uuid, String context) {
        // check user blocked or not
        RedisUtils.checkUserBlocked(phoneNumber, redisTemplate);
        // if user data already exists in the redis
        // then return to the page where he left i.e. Component where Username, About, ProfilePicture have to filled in
        // Define keys
        String otpKey = "otp:" + uuid;
        String attemptKey = "attempt:" + uuid;
        String blockKey = "block:" + uuid;
        String maxGenerateKey = context + ":maxGenerate:" + phoneNumber;
        String indefiniteBlockKey = "indefiniteBlock:" + phoneNumber;
        String otpTimestampKey = "otpTimestamp:" + phoneNumber;

        // check if OTP already exists and is not expied
        Integer existingOtp = (Integer) redisTemplate.opsForValue().get(otpKey);
        Long otpTimestamp = (Long) redisTemplate.opsForValue().get(otpTimestampKey);
        // If an OTP exists and it is not expired, prompt the user to use the existing OTP
        if (existingOtp != null && otpTimestamp != null) {
            long timeElapsed = System.currentTimeMillis() - otpTimestamp;
            if (timeElapsed < TimeUnit.MINUTES.toMillis(OTP_TTL_MINUTE)) {
                log.info("User with phoneNumber {} attempted to generate OTP but an existing OTP is still valid.", phoneNumber);
                // OTP is still valid within TTL, inform the user to use existing OTP
                throw new RuntimeException("An OTP was already sent. Please use it to continue");
            }
        }
        // check if this is a returning user and the first OTP generation was over 2 days ago
        if (otpTimestamp != null && System.currentTimeMillis() - otpTimestamp > TimeUnit.DAYS.toMillis((2))) {
            // block the user indefinitely i.e. for 30 days
            RedisUtils.blockUserIndefinitely(phoneNumber, "User is blocked for not returning back after OTP generation", INDEFINITE_BLOCK, redisTemplate);
        }

        Integer maxOTPGeneration = (Integer) redisTemplate.opsForValue().get(maxGenerateKey);
        if (maxOTPGeneration != null && maxOTPGeneration >= MAX_OTP_GENERATION) {
            // block user for 30 days
            log.info("User with phoneNumber {} exceeded OTP generation limit. Blocking the user.", phoneNumber);
            redisTemplate.opsForValue().set(indefiniteBlockKey, "Blocked for exceeding OTP generation limit at " + System.currentTimeMillis(), INDEFINITE_BLOCK, TimeUnit.DAYS);
            throw new UserBlockedException("Too many OTP requests. You're blocked for indefinite period, Please use different number");
        }
        // Check if user is blocked or not
        if (redisTemplate.hasKey(blockKey)) {
            // retrieve block time from redis
            Long blockEndTime = (Long) redisTemplate.opsForValue().get(blockKey);
            if (System.currentTimeMillis() < blockEndTime) {
                throw new UserBlockedException("You are temporarily blocked, Please try again later");
            } else {
                // block time is expired, clear block
                redisTemplate.delete(blockKey);
            }
        }
        // Generate Otp
        Integer otpValue = generateOtp();
        // store (otpKey, otpValue, TTL, TimeUnit in minutes) in redis
        redisTemplate.opsForValue().set(otpKey, otpValue, OTP_TTL_MINUTE, TimeUnit.MINUTES);

        // Initialize attempts if not set
        // This is for checking how many times a user has entered an otp for verification
        if (!redisTemplate.hasKey(attemptKey)) {
            redisTemplate.opsForValue().set(attemptKey, MAX_ATTEMPTS);
        }

        redisTemplate.opsForValue().increment(maxGenerateKey);
        // Update timestamp for the latest OTP generation
        redisTemplate.opsForValue().set(otpTimestampKey, System.currentTimeMillis(), 2, TimeUnit.DAYS);
        // Send Otp via message

        // smsService.sendOtp(phoneNumber, otpValue);
        boolean smsSent = twilioOtpService.sendOtp(phoneNumber, otpValue);
        if (smsSent) {
            log.info("Otp {}, sent to {}", otpValue, phoneNumber);
            return Pair.of("Otp sent successfully to your registered phoneNumber, Please Verify to continue", true);
        } else {
            log.error("Failed to send OTP to {}", phoneNumber);
            return Pair.of("Failed to send Otp to your registered phoneNumber", false);
        }
    }

    // generate otp method
    public Integer generateOtp() {
        return ThreadLocalRandom.current().nextInt(100000, 999999);
    }

    @Override
    public OtpVerificationResponse verifyOtp(String otp, HttpServletRequest request, String context) {
        // Extract uuid from the request
        String uuid = CookieUtils.extractCookie(request);
        if (uuid == null) {
            log.info("No session cookie found during OTP verification.");
            return new OtpVerificationResponse("Session expired. Please restart the process.", false);
        }
        // Define key
        String otpKey = "otp:" + uuid;
        String attemptKey = "attempt:" + uuid;
        String blockKey = "block:" + uuid;

        // retrieved otp from redis
        Integer otpValue = (Integer) redisTemplate.opsForValue().get(otpKey);
        // retrieve attempts from redis
        Integer attemptValue = (Integer) redisTemplate.opsForValue().get(attemptKey);

        // otp value is null or not
        if (otpValue == null) {
            log.info("OTP expired for session UUID: {}", uuid);
            return new OtpVerificationResponse("OTP expired. Please restart the process.", false);
        }

        // check otpValue is equal to entered otp or not
        if (!otpValue.toString().equals(otp)) {
            // check attempts left
            if (attemptValue > 1) {
                // decrease attempt by 1
                attemptValue -= 1;
                // save new value
                redisTemplate.opsForValue().set(attemptKey, attemptValue);
                log.warn("Invalid OTP entered for UUID: {}", uuid);
                // throw exception with message
                return new OtpVerificationResponse("Invalid OTP. You have " + attemptValue + " attempts left", false);
            } else { // attempt value < 1
               /* // then block the user
                redisTemplate.opsForValue().set(blockKey, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(BLOCKED_TIME), BLOCKED_TIME, TimeUnit.MINUTES);
                // remove attempts after block
                redisTemplate.delete(attemptKey);
                return new OtpVerificationResponse("Too many failed attempts, You are blocked for: " + BLOCKED_TIME + "min", false);*/
                redisTemplate.opsForValue().set(blockKey, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(BLOCKED_TIME), BLOCKED_TIME, TimeUnit.MINUTES);
                redisTemplate.delete(attemptKey);
                long blockEndTime = (Long) redisTemplate.opsForValue().get(blockKey);
                long remainingTime = blockEndTime - System.currentTimeMillis();
                return new OtpVerificationResponse("Too many failed attempts. You are blocked for " + remainingTime / 60000 + " minutes", false);
            }
        } else { // if correct otp entered
            // delete otp and attempt data from redis
            redisTemplate.delete(otpKey);
            redisTemplate.delete(attemptKey);

            // Extract metadata from the redis
            // and add verifiedAt and allowedUntil(24 hrs)
            String metaKey = "signup:verified:" + uuid;
            Map<String, Object> metadata = (Map<String, Object>) redisTemplate.opsForValue().get(metaKey);
            long verifiedAt = System.currentTimeMillis();
            long allowedUntil = verifiedAt + TimeUnit.HOURS.toMillis(24);
            metadata.put("verifiedAt", verifiedAt);
            metadata.put("allowedUntil", allowedUntil);
            redisTemplate.opsForValue().set(metaKey, metadata, 24, TimeUnit.HOURS);


            if (context.equals("signup")) {
                redisTemplate.delete("signup:maxGenerate:" + metadata.get("phoneNumber"));
            } else if (context.equals("login")) {
                redisTemplate.delete("login:maxGenerate:" + metadata.get("phoneNumber"));
            }
            redisTemplate.delete("otpTimestamp:" + metadata.get("phoneNumber"));
            // return otp verify successfully
            log.info("OTP successfully verified for UUID: {}", uuid);
            return new OtpVerificationResponse("OTP verified successfully", true);
        }
    }
}
