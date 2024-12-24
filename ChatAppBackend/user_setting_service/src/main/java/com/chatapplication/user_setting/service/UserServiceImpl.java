package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import com.chatapplication.user_setting.entity.Settings;
import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.exception.ResourceNotFoundException;
import com.chatapplication.user_setting.repository.UserRepository;
import com.chatapplication.user_setting.util.CookieUtils;
import com.chatapplication.user_setting.util.SettingsUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@Transactional
public class UserServiceImpl implements IUserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RedisTemplate<String,Object> redisTemplate;

    @Override
    public String saveUser(SaveUserReqDTO saveUserReqDTO, HttpServletRequest request) {
        // Retrieve UUID from HttpOnly cookie
        String uuid= CookieUtils.extractCookie(request);
        // Retrieve data from redis
        String redisKey = "signup:verified:"+uuid;
        Map<String,Object> retrieveData = (Map<String, Object>) redisTemplate.opsForValue().get(redisKey);
        // after retrieving data from the redis delete the session from redis
        log.info("Deleting Redis session key: {}", redisKey);
        redisTemplate.delete(redisKey);

        if (retrieveData == null) {
            log.error("Verification data not found in Redis for UUID: {}", uuid);
            throw new ResourceNotFoundException("Verification data not found");
        }
        String email = (String)retrieveData.get("email");
        String phoneNumber = (String)retrieveData.get("phoneNumber");

        // Create a default setting for the given user
        Settings defaultSettings = new Settings();
        defaultSettings.setSettingsMap(new HashMap<>(SettingsUtils.DEFAULT_SETTINGS));
        // Create new User entity
        User user = User.builder()
                .email(email)
                .phoneNumber(phoneNumber)
                .about(saveUserReqDTO.getAbout())
                .username(saveUserReqDTO.getUsername())
                .profilePhoto(saveUserReqDTO.getProfilePicture())
                .settings(defaultSettings)
                .build();
        // save user in the repository
        userRepository.save(user);
        return "User saved successfully with default settings";
    }
}
