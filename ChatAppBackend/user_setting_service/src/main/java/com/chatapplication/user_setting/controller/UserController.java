package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import com.chatapplication.user_setting.dto.UserDataResponseDTO;
import com.chatapplication.user_setting.service.interfaces.IUserService;
import com.chatapplication.user_setting.util.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    IUserService userService;

    // save user
    @PostMapping("/save")
    public ResponseEntity<?> saveUser(@RequestBody SaveUserReqDTO saveUserReqDTO, HttpServletRequest request) {
        String result = userService.saveUser(saveUserReqDTO, request);
        // Clear Cookie
        String clearCookie = CookieUtils.deleteCookie("signUpSessionId");
        return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", clearCookie).body(result);
    }

    // Get user
    @GetMapping("/")
    public ResponseEntity<?> getUser() {
        // Right now getting a user without using any identifier
        UserDataResponseDTO user = userService.getUser();
        log.info("User: {}", user);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    // update user data
    @PatchMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestBody SaveUserReqDTO updateRequestDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(updateRequestDTO));
    }

    // update logged-in user last seen when -- for offline, logout, or closes the app
    @PatchMapping("/updateLastSeen")
    public void updateUserLastSeen() {
        userService.updateUserLastSeen();
    }
}
