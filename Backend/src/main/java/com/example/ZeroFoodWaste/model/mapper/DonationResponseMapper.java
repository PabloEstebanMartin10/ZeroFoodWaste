package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.DonationResponseDTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.DonationAssignment;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.NoSuchElementException;

@Mapper(componentModel = "spring")
public interface DonationResponseMapper {

    //region donation -> dto
    @Mapping(target = "establishmentId", source = "establishment.id")
    @Mapping(target = "assignmentId", source = "assignment.id")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "unit", source = "unit")
    @Mapping(target = "establishment", source = "establishment.name")
    @Mapping(target = "foodBank", source = "assignment.foodBank.name")
    DonationResponseDTO toDTO(Donation donation);

    List<DonationResponseDTO> toDTOList(List<Donation> donations);
    //endregion

    //region dto -> entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "establishment", ignore = true)
    @Mapping(target = "assignment", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", expression = "java(mapStatus(dto.getStatus()))")
    void updateEntityFromDTO(DonationResponseDTO dto, @MappingTarget Donation donation);

    @Mapping(target = "establishment", ignore = true)
    @Mapping(target = "assignment", ignore = true)
    @Mapping(target = "status", expression = "java(mapStatus(dto.getStatus()))")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Donation toEntity(DonationResponseDTO dto);
    
    //endregion

    default DonationStatus mapStatus(String status) {
        if (status == null) return null;
        try {
            return DonationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid DonationStatus: " + status);
        }
    }
}
