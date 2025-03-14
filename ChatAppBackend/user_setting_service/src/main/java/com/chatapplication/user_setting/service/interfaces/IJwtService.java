package com.chatapplication.user_setting.service.interfaces;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;

public interface IJwtService {
    // Methods
    String generateJWT(String subject, long expirationTime);

    Claims validateToken(String token);

    String getSubjectFromToken(String token);

    boolean isTokenExpire(String token);
}
