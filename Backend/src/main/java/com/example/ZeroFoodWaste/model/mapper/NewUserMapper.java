package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.entity.User;
import com.example.ZeroFoodWaste.model.enums.Role;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class NewUserMapper {
    @Autowired
    protected EstablishmentRepository establishmentRepository;

    @Autowired
    protected FoodBankRepository foodBankRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "establishment", ignore = true)
    @Mapping(target = "foodBank", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    public abstract User toEntity(NewUserDTO dto);

    @AfterMapping
    protected void linkRelatedEntity(NewUserDTO dto, @MappingTarget User user) {
        if (dto.getRole() == Role.Establishment) {
            Establishment est = new Establishment();
            est.setUser(user);
            est.setName(dto.getEstablishmentName());
            est.setAddress(dto.getEstablishmentAddress());
            est.setContactPhone(dto.getEstablishmentContactPhone());
            est.setOpeningHours(dto.getOpeningHours());
            user.setEstablishment(est);
        }else if (dto.getRole() == Role.FoodBank) {
            FoodBank fb = new FoodBank();
            fb.setUser(user);
            fb.setName(dto.getFoodBankName());
            fb.setAddress(dto.getFoodBankAddress());
            fb.setContactPhone(dto.getFoodBankContactPhone());
            fb.setCoverageArea(dto.getCoverageArea());
            user.setFoodBank(fb);
        }
    }
}
