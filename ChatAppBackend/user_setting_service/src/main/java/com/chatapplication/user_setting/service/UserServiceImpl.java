package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.repository.UserRepository;
import com.chatapplication.user_setting.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;

@Service
@Transactional
public class UserServiceImpl implements IUserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RedisTemplate<String,Object> redisTemplate;

    @Override
    public String saveUser(SaveUserReqDTO saveUserReqDTO, HttpServletRequest request) {
        System.out.println(request.getHeader("cookie"));
        // Retrieve UUID from HttpOnly cookie
        String uuid= CookieUtils.extractCookie(request);
        // Retrieve data from redis
        String redisKey = "signup:verified:"+uuid;
        Map<String,Object> retrieveData = (Map<String, Object>) redisTemplate.opsForValue().get(redisKey);
        // after retrieving data from the redis delete the seesion from redis
        redisTemplate.delete(redisKey);

        if (retrieveData == null) {
            throw new RuntimeException("Verification data not found");
        }
        String email = (String)retrieveData.get("email");
        String phoneNumber = (String)retrieveData.get("phoneNumber");
        // Create new User entity
        User user = User.builder()
                .email(email)
                .phoneNumber(phoneNumber)
                .about(saveUserReqDTO.getAbout())
                .username(saveUserReqDTO.getUsername())
                .profilePhoto(saveUserReqDTO.getProfilePicture())
                .build();
        userRepository.save(user);

        return "User saved successfully";
    }
}
