package com.chatapplication.user_setting.filter;

import com.chatapplication.user_setting.exception.ErrorResponse;
import com.chatapplication.user_setting.service.impl.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer")) {
            String token = authHeader.substring(7);
            
            try {
                // Try to validate the token
                Claims claims = jwtService.validateToken(token);
                String username = claims.getSubject();
                
                UsernamePasswordAuthenticationToken authenticated = 
                    new UsernamePasswordAuthenticationToken(username, null, null);
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authenticated);
                SecurityContextHolder.setContext(context);
                
                // Continue with the filter chain
                filterChain.doFilter(request, response);
            } catch (ExpiredJwtException ex) {
                // Handle expired token specifically
                handleAuthError(response, HttpStatus.UNAUTHORIZED, "JWT_EXPIRED", "Access Token Expired");
            } catch (SignatureException ex) {
                handleAuthError(response, HttpStatus.UNAUTHORIZED, "JWT_INVALID_SIGNATURE", "Invalid JWT Signature");
            } catch (MalformedJwtException ex) {
                handleAuthError(response, HttpStatus.UNAUTHORIZED, "JWT_MALFORMED", "Malformed JWT token");
            } catch (JwtException | IllegalArgumentException ex) {
                handleAuthError(response, HttpStatus.UNAUTHORIZED, "JWT_INVALID", "Invalid JWT token");
            }
            return; // don't continue filter chain after sending response
        }
        
        // If no token or not bearer, continue with filter chain
        filterChain.doFilter(request, response);
    }
    
    private void handleAuthError(HttpServletResponse response, HttpStatus status, String error, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        
        ObjectMapper mapper = new ObjectMapper();
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error(error)
                .message(message)
                .build();
                
        response.getWriter().write(mapper.writeValueAsString(errorResponse));
    }
}
