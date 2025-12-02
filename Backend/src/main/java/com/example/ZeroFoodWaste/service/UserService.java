package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.User;
import com.example.ZeroFoodWaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User createUser(User user) {
        userRepository.save(user);
        return user;
    }

    public User LoginUser(String email, String passwordHash) {
        return userRepository.findByEmailAndPasswordHash(email, passwordHash).orElseThrow(
                () -> new NoSuchElementException("Invalid user or password "));
    }



}
