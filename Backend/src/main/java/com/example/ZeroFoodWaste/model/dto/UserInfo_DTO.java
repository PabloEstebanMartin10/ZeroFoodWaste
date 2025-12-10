package com.example.ZeroFoodWaste.model.dto;

import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.enums.Role;
import lombok.Data;

@Data
public class UserInfo_DTO {
    private Long id;
    private String email;
    private Role role;
}
