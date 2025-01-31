package com.chatapplication.user_setting.service;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import com.chatapplication.user_setting.dto.UserDataResponseDTO;
import com.chatapplication.user_setting.entity.Settings;
import com.chatapplication.user_setting.entity.User;
import com.chatapplication.user_setting.exception.ResourceNotFoundException;
import com.chatapplication.user_setting.repository.UserRepository;
import com.chatapplication.user_setting.util.CookieUtils;
import com.chatapplication.user_setting.util.SettingsUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@Transactional
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    ObjectMapper objectMapper;

    @Override
    public String saveUser(SaveUserReqDTO saveUserReqDTO, HttpServletRequest request) {
        // Retrieve UUID from HttpOnly cookie
        String uuid = CookieUtils.extractCookie(request, "signUpSessionId");
        // Retrieve data from redis
        String redisKey = "signup:verified:" + uuid;
        Map<String, Object> retrieveData = (Map<String, Object>) redisTemplate.opsForValue().get(redisKey);
        // after retrieving data from the redis delete the session from redis
        log.info("Deleting Redis session key: {}", redisKey);
        redisTemplate.delete(redisKey);

        if (retrieveData == null) {
            log.error("Verification data not found in Redis for UUID: {}", uuid);
            throw new ResourceNotFoundException("Verification data not found");
        }
        String email = (String) retrieveData.get("email");
        String phoneNumber = (String) retrieveData.get("phoneNumber");

        // Create a default setting for the given user
        Settings defaultSettings = new Settings();
        defaultSettings.setSettingsMap(new HashMap<>(SettingsUtils.DEFAULT_SETTINGS));
        // Create new User entity
        User user = User.builder()
                .email(email)
                .phoneNumber(phoneNumber)
                .about(saveUserReqDTO.getAbout())
                .username(saveUserReqDTO.getUsername())
                .profilePhoto(saveUserReqDTO.getProfilePhoto())
                .settings(defaultSettings)
                .build();
        // save user in the repository
        userRepository.save(user);
        return "User saved successfully with default settings";
    }

    @Override
    public UserDataResponseDTO getUser() {
        String email = (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        log.info("User From repo: {}", user);
        // Map user entity to dto
        return UserDataResponseDTO.builder()
                .username(user.getUsername())
                .about(user.getAbout())
                .profilePhoto(user.getProfilePhoto())
                .senderId(user.getUserId())
                .build();
    }

    @Override
    public String updateUser(SaveUserReqDTO updateRequestDTO) {
        System.out.println("Username : " + updateRequestDTO.getUsername());
        System.out.println("About: " + updateRequestDTO.getAbout());
        System.out.println("Image name: " + updateRequestDTO.getProfilePhoto());
        // Get user from the repository
        User user = userRepository.findById(1L).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // update the username, about, image if not null
        Optional.ofNullable(updateRequestDTO.getUsername()).ifPresent(user::setUsername);
        Optional.ofNullable(updateRequestDTO.getAbout()).ifPresent(user::setAbout);
        Optional.ofNullable(updateRequestDTO.getProfilePhoto()).ifPresent(user::setProfilePhoto);
        System.out.println("User after update: " + user);
        userRepository.save(user);
        return "User updated successfully";
    }

    // update logged-in user last seen
    @Override
    public void updateUserLastSeen(){
        // Get Email from SecurityContextHolder
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // find user in the system
        if(email!=null){
            User user = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User is not present in the system"));
            // set the user last seen
            user.setLastSeen(LocalDateTime.now());
        }
    }
}
