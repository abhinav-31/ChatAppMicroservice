package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.GenerateOtpResponseDTO;
import com.chatapplication.user_setting.dto.LoginRequestDTO;
import com.chatapplication.user_setting.dto.SignUpRequestDTO;
import com.chatapplication.user_setting.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class AuthServiceImpl implements IAuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private IOtpService otpService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public GenerateOtpResponseDTO signUpUser(SignUpRequestDTO signUpRequestDTO) {
        // Check user is blocked or not
        String phoneNumber = signUpRequestDTO.getPhoneNumber();
        if(redisTemplate.hasKey("block:"+phoneNumber)){
            // tell user you are blocked
            return new GenerateOtpResponseDTO("You are temporarily blocked, Please try again later",false,"");
        }

        if (userRepository.existsByEmail(signUpRequestDTO.getEmail())) {  // check email exist or not
            return new GenerateOtpResponseDTO("Email already exist!",false,"");
        } else if (userRepository.existsByPhoneNumber(signUpRequestDTO.getPhoneNumber())) {  // then check phone number exist or not
            return new GenerateOtpResponseDTO("Phone Number already exist",false,"");
        } else {
            // as otp generated and send successfully
            String uuid = UUID.randomUUID().toString();
            Map<String, Object> metadata = new HashMap<String, Object>();
            metadata.put("email", signUpRequestDTO.getEmail());
            metadata.put("phoneNumber", signUpRequestDTO.getPhoneNumber());

            String metaKey = "signup:verified:"+uuid;
            redisTemplate.opsForValue().set(metaKey, metadata);
            redisTemplate.expire(metaKey,2, TimeUnit.DAYS);
            Pair<String, Boolean> generateOtpResponse = otpService.generateOtp(signUpRequestDTO.getPhoneNumber(), uuid, "signup");
            return new GenerateOtpResponseDTO(generateOtpResponse.getFirst(),generateOtpResponse.getSecond(),uuid);
        }
    }

    @Override
    public GenerateOtpResponseDTO userLogin(LoginRequestDTO loginRequestDTO) {
        if (!userRepository.existsByPhoneNumber(loginRequestDTO.getPhoneNumber())) {
            return new GenerateOtpResponseDTO("Phone Number not exist, Please sign up first",false,"");
        } else {
            String uuid = UUID.randomUUID().toString();
            Pair<String, Boolean> generateOtpResponse = otpService.generateOtp(loginRequestDTO.getPhoneNumber(), uuid, "login");
            return new GenerateOtpResponseDTO(generateOtpResponse.getFirst(),generateOtpResponse.getSecond(),uuid);
        }
    }
}
