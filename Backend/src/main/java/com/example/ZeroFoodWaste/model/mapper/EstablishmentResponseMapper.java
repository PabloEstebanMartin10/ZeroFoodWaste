package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.EstablishmentResponseDTO;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.User;
import com.example.ZeroFoodWaste.repository.UserRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.NoSuchElementException;

public abstract class EstablishmentResponseMapper {

    @Autowired
    protected UserRepository userRepository;

    //region Entity->DTO
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "establishmentID", source = "id")
    public abstract EstablishmentResponseDTO toDTO(Establishment establishment);
    //endregion

    //region DTO->Entity
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "user",ignore = true)
    @Mapping(target = "donations",ignore = true)
    public abstract Establishment toEntity(EstablishmentResponseDTO establishmentResponseDTO);
    //endregion

    //region DTO->Entity update
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "user",ignore = true)
    @Mapping(target = "donations",ignore = true)
    public abstract void updateEntityFromDTO(
            EstablishmentResponseDTO dto,
            @MappingTarget Establishment establishment
    );
    //endregion

    //region afterMapping
    @AfterMapping
    protected void linkUser(
            EstablishmentResponseDTO dto,
            @MappingTarget Establishment establishment
    ){
        if (dto.getUserId()!= null){
            User user = userRepository.findById(dto.getUserId()).orElseThrow(
                    ()-> new NoSuchElementException("User not found")
            );
            establishment.setUser(user);
        }
    }
    //endregion
}
