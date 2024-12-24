package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.dto.SaveUserReqDTO;
import com.chatapplication.user_setting.service.IUserService;
import com.chatapplication.user_setting.util.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    IUserService userService;

    // save user
    @PostMapping("/save")
    public ResponseEntity<?> saveUser(@RequestBody SaveUserReqDTO saveUserReqDTO, HttpServletRequest request) {
        String result = userService.saveUser(saveUserReqDTO,request);
        // Clear Cookie
        String clearCookie = CookieUtils.deleteCookie(request,"signUpSessionId");
        return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie",clearCookie).body(result);
    }

}
