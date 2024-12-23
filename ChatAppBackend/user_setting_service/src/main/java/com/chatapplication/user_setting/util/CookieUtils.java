package com.chatapplication.user_setting.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.experimental.UtilityClass;
import org.springframework.http.ResponseCookie;

@UtilityClass
public class CookieUtils {

    public String extractCookie(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if(cookies!=null){
            for(Cookie cookie : cookies){
                if("signUpSessionId".equals(cookie.getName())){
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public String generateCookie(String value, long maxAge){
        ResponseCookie cookie = ResponseCookie.from("signUpSessionId", value)
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")   // prevents CSRF attacks
                .maxAge(maxAge)
                .build();
        return cookie.toString();
    }

    // Delete Cookie
    public String deleteCookie(HttpServletRequest request, String cookieName){
        ResponseCookie cookie = ResponseCookie.from(cookieName,null)
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")   // prevents CSRF attacks
                .maxAge(0)
                .build();
        return cookie.toString();
    }
}
