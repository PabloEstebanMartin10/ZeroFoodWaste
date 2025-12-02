package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailPasswordHash(String email, String passwordHash);
}
