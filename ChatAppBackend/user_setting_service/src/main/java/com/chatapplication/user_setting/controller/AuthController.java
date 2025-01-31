package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.dto.*;
import com.chatapplication.user_setting.service.IAuthService;
import com.chatapplication.user_setting.service.IOtpService;
import com.chatapplication.user_setting.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Validated
@Slf4j
public class AuthController {
    @Autowired
    IAuthService authService;
    @Autowired
    IOtpService otpService;

    // Sign-Up
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpRequestDTO signUpRequestDTO, HttpServletRequest request) {
        // Check cookie exist or not
        // if exist then return from here to Username, about, profilepicture component
        Cookie[] cookies = request.getCookies();
        boolean cookieExist = false;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("signUpSessionId".equals(cookie.getName())) {
                    cookieExist = true;
                    break;
                }
            }
        }
        if (cookieExist) {
            return ResponseEntity.status(HttpStatus.FOUND).body("User already signed up, Proceed further");
        } else {
            GenerateOtpResponseDTO response = authService.signUpUser(signUpRequestDTO);
            if(response.isSuccess()){
                long maxAge = 2 * 24 * 60 * 60;
                String cookie = CookieUtils.generateCookie(response.getData(), maxAge);
                return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", cookie).body(response.getMessage());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getMessage());
            }

        }
    }

    // Verify OTP for Sign-UP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody @Valid OtpVerifyRequestDTO otpVerifyRequestDTO, HttpServletRequest request) {
        OtpVerificationResponse otpVerificationResponse = otpService.verifyOtp(otpVerifyRequestDTO.getOtp(), request, otpVerifyRequestDTO.getContext());
        if (otpVerificationResponse.isSuccess()) {
            // create a cookie
            String uuid = CookieUtils.extractCookie(request);
            long maxAge = 24 * 60 * 60;
            String cookie = CookieUtils.generateCookie(uuid, maxAge);
            return ResponseEntity.status(HttpStatus.OK).header("Set-Cookie", cookie).body(otpVerificationResponse);
        }
        // If Otp verification fails
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(otpVerificationResponse);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody @Valid LoginRequestDTO loginRequestDTO) {
        GenerateOtpResponseDTO response = authService.userLogin(loginRequestDTO);
        if(response.isSuccess()){
            String cookie = CookieUtils.generateCookie(response.getData(), 2 * 24 * 60 * 60);
            return ResponseEntity.status(HttpStatus.OK).header("Set-Cookie",cookie).body(response.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getMessage());
        }

    }
    // Verify OTP for Login => use verifyOtp

    // Refresh Token End-Point

    // Logout

}
