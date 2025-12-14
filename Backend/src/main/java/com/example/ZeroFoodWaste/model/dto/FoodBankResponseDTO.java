package com.example.ZeroFoodWaste.model.dto;

import lombok.Data;

@Data
public class FoodBankResponseDTO {
    private Long id;
    private Long userId;
    private String name;
    private String address;
    private String contactPhone;
    private String openingHours;
    private String description;
    private String email;
}
