package com.example.ZeroFoodWaste.model.dto;

import com.example.ZeroFoodWaste.model.enums.Role;
import lombok.Data;

@Data
public class NewUserDTO {
    //region userData
    private String email;
    private String password;

    private Role role;
    //endregion

    //region EstablishmentData
    private String establishmentName;
    private String establishmentAddress;
    private String establishmentContactPhone;
    private String openingHours;
    //endregion

    //region FoodBankData
    private String foodBankName;
    private String foodBankAddress;
    private String foodBankContactPhone;
    //endregion

}
