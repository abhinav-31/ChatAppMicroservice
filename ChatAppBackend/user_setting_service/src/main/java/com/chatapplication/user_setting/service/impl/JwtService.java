package com.chatapplication.user_setting.service.impl;

import com.auth0.jwt.JWT;
import com.chatapplication.user_setting.service.interfaces.IJwtService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.security.Key;
import java.util.Date;

@Service
@Getter
public class JwtService implements IJwtService {
    @Value("${jwt.SECRET_KEY}")
    private String SECRET_KEY;
    @Value("${jwt.EXPIRATIONTIME.ACCESSTOKEN}")
    private long ACCESSTOKEN_EXPIRATION_TIME;
    @Value("${jwt.EXPIRATIONTIME.REFRESHTOKEN}")
    private long REFRESHTOKEN_EXPIRATION_TIME;
    private Key key;

    @PostConstruct
    public void initJwtService() {
        key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    @Override
    public String generateJWT(String subject, long time) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + time))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Generate JWT
    public String generateAccessJWT(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + ACCESSTOKEN_EXPIRATION_TIME))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshJWT(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + REFRESHTOKEN_EXPIRATION_TIME))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate JWT
    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @ExceptionHandler

    // Get Email(subject) from token
    public String getSubjectFromToken(String token) {
        return JWT.decode(token).getSubject();
    }

    // check token expire
    public boolean isTokenExpire(String token) {
        return JWT.decode(token).getExpiresAt().before(new Date());
    }
}
