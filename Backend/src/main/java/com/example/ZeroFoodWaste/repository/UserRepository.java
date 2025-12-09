package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPasswordHash(String email, String passwordHash);
    Optional<User> findByUsername(String username);
}
