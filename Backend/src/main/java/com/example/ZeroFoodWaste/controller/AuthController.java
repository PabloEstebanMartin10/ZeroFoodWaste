package com.example.ZeroFoodWaste.controller;

import com.example.ZeroFoodWaste.config.JwtUtils;
import com.example.ZeroFoodWaste.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtils jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
            String token = jwtUtil.generateToken(request.email());
            return ResponseEntity.ok(new LoginResponse(token));
        } catch (AuthenticationException e) {
            // Return a 401 Unauthorized response with an error message
            throw new UserNotFoundException(request.email);
        }
    }

    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String token) {}
}
