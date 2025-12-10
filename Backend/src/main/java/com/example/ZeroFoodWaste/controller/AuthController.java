package com.example.ZeroFoodWaste.controller;

import com.example.ZeroFoodWaste.config.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        System.out.println("login");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

// Si no lanza excepción, autenticación correcta
        String token = jwtUtil.generateToken(request.email());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    public record LoginRequest(String email, String password) {}
    public record LoginResponse(String token) {}
}
