package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.NewDonationDTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
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
    @Mapping(target = "establishment", source = "establishmentId")
    @Mapping(target = "status", expression = "java(mapStatus(dto.getStatus()))")
    @Mapping(target = "assignment", ignore = true)
    public abstract Donation toEntity(NewDonationDTO dto);

    protected Establishment mapEstablishment(Long id) {
        if (id == null) return null;
        return establishmentRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Couldn't find the Establishment"));
    }

    protected DonationStatus mapStatus(String status) {
        if (status == null) return null;
        try {
            return DonationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid DonationStatus: " + status);
        }
    }
}
