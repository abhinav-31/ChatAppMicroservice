package com.chatapplication.user_setting.controller;

import com.chatapplication.user_setting.dto.*;
import com.chatapplication.user_setting.service.interfaces.IAuthService;
import com.chatapplication.user_setting.service.interfaces.IOtpService;
import com.chatapplication.user_setting.service.impl.JwtService;
import com.chatapplication.user_setting.util.CookieUtils;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/auth")
@Validated
@Slf4j
public class AuthController {
    @Autowired
    IAuthService authService;
    @Autowired
    IOtpService otpService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private RedisTemplate redisTemplate;

    private static final String SIGNUP_COOKIE = "signUpSessionId";
    private static final String LOGIN_COOKIE = "loginSessionId";
    @Value("${jwt.EXPIRATIONTIME.ACCESSTOKEN}")
    private long ACCESSTOKEN_EXPIRATION_TIME;
    @Value("${jwt.EXPIRATIONTIME.REFRESHTOKEN}")
    private long REFRESHTOKEN_EXPIRATION_TIME;


    // Sign-Up
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpRequestDTO signUpRequestDTO, HttpServletRequest request) {
        // Check cookie exist or not
        // if exist then return from here to Username, about, profilepicture component
        String cookieExist = CookieUtils.extractCookie(request, SIGNUP_COOKIE);
        if (cookieExist != null) {
            return ResponseEntity.status(HttpStatus.OK).body("User already signed up, Proceed further");
        } else {
            GenerateOtpResponseDTO response = authService.signUpUser(signUpRequestDTO);
            if (response.isSuccess()) {
                long maxAge = 2;
                String cookie = CookieUtils.generateCookie(SIGNUP_COOKIE, response.getData(), maxAge);
                return ResponseEntity.status(HttpStatus.CREATED).header("Set-Cookie", cookie).body(response.getMessage());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getMessage());
            }

        }
    }

    // Verify OTP for Sign-UP
    @PostMapping("/verify-otp/{keepLoggedIn}")
    public ResponseEntity<?> verifyOtp(@CookieValue(value = "loginSessionId", required = false) String cookieValue, @RequestBody @Valid OtpVerifyRequestDTO otpVerifyRequestDTO, HttpServletRequest request, @PathVariable Boolean keepLoggedIn) {
        OtpVerificationResponse otpVerificationResponse = otpService.verifyOtp(otpVerifyRequestDTO.getOtp(), request, otpVerifyRequestDTO.getContext());

        if (otpVerificationResponse.isSuccess() && otpVerifyRequestDTO.getContext().equals("signup") && !keepLoggedIn) {
            String uuid = CookieUtils.extractCookie(request, SIGNUP_COOKIE);
            long maxAge = 2; // 2 days
            String cookie = CookieUtils.generateCookie(SIGNUP_COOKIE, uuid, maxAge);
            return ResponseEntity.status(HttpStatus.OK).header("Set-Cookie", cookie).body(otpVerificationResponse);
        } else if (otpVerificationResponse.isSuccess() && otpVerifyRequestDTO.getContext().equals("login") && keepLoggedIn) { // login and keepLoggedIn true
            String uuid = CookieUtils.extractCookie(request, LOGIN_COOKIE);
            CookieUtils.deleteCookie(LOGIN_COOKIE);

            String metaKey = otpVerifyRequestDTO.getContext() + ":verified:" + uuid;

            Map<String, Object> metadata = (Map<String, Object>) redisTemplate.opsForValue().get(metaKey);
            redisTemplate.delete("login" + ":verified:" + uuid);
            String accessToken = jwtService.generateJWT((String) metadata.get("email"), ACCESSTOKEN_EXPIRATION_TIME);
            String refreshToken = jwtService.generateJWT(uuid, REFRESHTOKEN_EXPIRATION_TIME);
            String cookie = CookieUtils.generateCookie(LOGIN_COOKIE, refreshToken, 30);
            // store the refresh token in the redis
            redisTemplate.opsForValue().set("refresh:" + uuid, (String) metadata.get("email"), Duration.ofDays(30));
            return ResponseEntity.status(HttpStatus.OK).header("Set-Cookie", cookie).body(Map.of("accessToken", accessToken));
        } else if (otpVerificationResponse.isSuccess() && otpVerifyRequestDTO.getContext().equals("login") && !keepLoggedIn) {
            // just return successful verification
            return ResponseEntity.status(HttpStatus.OK).body(otpVerificationResponse.getMessage());
        }
        // If Otp verification fails
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(otpVerificationResponse);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody @Valid LoginRequestDTO loginRequestDTO) {
        GenerateOtpResponseDTO response = authService.userLogin(loginRequestDTO);
        if (response.isSuccess()) {
            String cookie = CookieUtils.generateCookie(LOGIN_COOKIE, response.getData(), 2);
            return ResponseEntity.status(HttpStatus.OK).header("Set-Cookie", cookie).body(response.getMessage());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getMessage());
        }

    }

    // Refresh Token End-Point
    @GetMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "loginSessionId", required = false) String loginSessionId) {

        if (loginSessionId == null || jwtService.validateToken(loginSessionId) == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please Logged In");
        }

        // get subject from Refresh Token i.e. uuid
        String uuid = jwtService.getSubjectFromToken(loginSessionId);
        String email = (String) redisTemplate.opsForValue().get("refresh:" + uuid);
        String newAccessToken = jwtService.generateAccessJWT(email);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("accessToken", newAccessToken));
    }
    
    // Logout
    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, CookieUtils.deleteCookie(LOGIN_COOKIE)).body("Logout Out Successfully");
    }
}
