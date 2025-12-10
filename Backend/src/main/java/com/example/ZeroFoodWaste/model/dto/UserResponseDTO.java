package com.example.ZeroFoodWaste.model.dto;

import com.example.ZeroFoodWaste.model.enums.Role;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private Role role;

    //optional id
    private Long establishmentId;
    private Long foodBankId;
}
