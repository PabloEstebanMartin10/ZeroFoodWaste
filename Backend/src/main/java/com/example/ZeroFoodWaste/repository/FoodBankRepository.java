package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.entity.FoodBank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodBankRepository extends JpaRepository<FoodBank, Long> {
    Optional<FoodBank> findByUserId(Long userId);
}
