package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.FoodBankResponseDTO;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.entity.User;
import com.example.ZeroFoodWaste.repository.UserRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.NoSuchElementException;

@Mapper(componentModel = "spring")
public abstract class FoodBankResponseMapper {
    @Autowired
    private UserRepository userRepository;

    //region Entity->DTO
    @Mapping(target = "userId", source = "user.id")
    public abstract FoodBankResponseDTO toDTO(FoodBank foodBank);
    //endregion

    //region DTO->Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    public abstract FoodBank toEntity(FoodBankResponseDTO foodBankResponseDTO);
    //endregion

    //region DTO->Entity update
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    public abstract void updateEntityFromDTO(
            FoodBankResponseDTO dto,
            @MappingTarget FoodBank foodBank
    );
    //endregion

    //region afterMapping
    @AfterMapping
    protected void linkUser(FoodBankResponseDTO dto, @MappingTarget FoodBank foodBank) {
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId()).orElseThrow(
                    () -> new NoSuchElementException("User not found")
            );
            foodBank.setUser(user);
        }
    }
}
