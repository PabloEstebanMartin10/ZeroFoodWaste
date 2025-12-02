package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;


}
