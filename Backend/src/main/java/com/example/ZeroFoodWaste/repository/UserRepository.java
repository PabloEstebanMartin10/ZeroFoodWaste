package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
