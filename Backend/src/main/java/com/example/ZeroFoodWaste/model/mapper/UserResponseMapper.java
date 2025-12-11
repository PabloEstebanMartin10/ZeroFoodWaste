package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.UserResponseDTO;
import com.example.ZeroFoodWaste.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class UserResponseMapper {

    @Mapping(target = "establishmentId", expression = "java(user.getEstablishment() != null ? user.getEstablishment().getId() : null)")
    @Mapping(target = "foodBankId", expression = "java(user.getFoodBank() != null ? user.getFoodBank().getId() : null)")
    public abstract UserResponseDTO toDTO(User user);

    @Mapping(target = "establishmentId", expression = "java(user.getEstablishment() != null ? user.getEstablishment().getId() : null)")
    @Mapping(target = "foodBankId", expression = "java(user.getFoodBank() != null ? user.getFoodBank().getId() : null)")
    @Mapping(target = "passwordHash", ignore = true)
    public abstract UserResponseDTO toDTOWithoutPass(User user);
}
