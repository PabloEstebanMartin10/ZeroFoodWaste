package com.example.ZeroFoodWaste.controller;

import com.example.ZeroFoodWaste.config.JwtUtils;
import com.example.ZeroFoodWaste.exception.EmailAlreadyExistsException;
import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.dto.UserResponseDTO;
import com.example.ZeroFoodWaste.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/User")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtils jwtUtil;

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody NewUserDTO newUserDTO){
        return ResponseEntity.ok(userService.createUser(newUserDTO));
    }

    @GetMapping
    public ResponseEntity<UserResponseDTO> getUserByToken(@RequestParam String token){
        String email = jwtUtil.extractUsername(token);
        return ResponseEntity.ok(userService.getByEmail(email));
    }
}
