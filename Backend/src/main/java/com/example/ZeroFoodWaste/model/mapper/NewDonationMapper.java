package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.NewDonationDTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.NoSuchElementException;

@Mapper(componentModel = "spring")
public abstract class NewDonationMapper {
    @Autowired
    private EstablishmentRepository establishmentRepository;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "establishment", source = "establishmentId") // conversion custom
    @Mapping(target = "status", source = "status")
    @Mapping(target = "assignments", ignore = true)
    public abstract Donation toEntity(NewDonationDTO dto);

    protected Establishment mapEstablishment(Long id){
        if(id == null) return null;
        return establishmentRepository.findById(id).orElseThrow(
                ()-> new NoSuchElementException("Couldn't find the Establishment")
        );
    }
}
