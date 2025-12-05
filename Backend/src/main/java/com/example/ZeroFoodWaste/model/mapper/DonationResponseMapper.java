package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.DonationResponseDTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.DonationAssignment;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.repository.DonationAssignmentRepository;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.NoSuchElementException;

@Mapper(componentModel = "spring")
public abstract class DonationResponseMapper {
    @Autowired
    protected EstablishmentRepository establishmentRepository;

    @Autowired
    protected DonationAssignmentRepository assignmentRepository;

    //region donation -> dto
    @Mapping(target = "establishmentId", source = "establishment.id")
    @Mapping(target = "assignmentId", source = "assignment.id")
    @Mapping(target = "status", source = "status")
    public abstract DonationResponseDTO toDTO(Donation donation);

    public abstract List<DonationResponseDTO> toDTOList(List<Donation> donations);
    //endregion

    //region dto -> entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "establishment", ignore = true)
    @Mapping(target = "assignment", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", expression = "java(DonationStatus.valueOf(dto.getStatus()))")
    public abstract void updateEntityFromDTO(DonationResponseDTO dto, @MappingTarget Donation donation);

    @Mapping(target = "establishment", ignore = true)
    @Mapping(target = "assignment", ignore = true)
    @Mapping(target = "status", expression = "java(DonationStatus.valueOf(dto.getStatus()))")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract Donation toEntity(DonationResponseDTO dto);

    @AfterMapping
    protected void linkRelations(DonationResponseDTO dto, @MappingTarget Donation donation) {
        if (dto.getEstablishmentId() != null) {
            Establishment est = establishmentRepository.findById(dto.getEstablishmentId()).orElseThrow(
                    () -> new NoSuchElementException("Couldn't find the establishment")
            );
            donation.setEstablishment(est);
        }

        if (dto.getAssignmentId() != null) {
            DonationAssignment assig = assignmentRepository.findById(dto.getAssignmentId()).orElseThrow(
                    () -> new NoSuchElementException("Couldn't find the Assignment")
            );
            donation.setAssignment(assig);
        }
    }

    //endregion
}
