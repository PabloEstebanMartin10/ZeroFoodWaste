    //region imports

package com.example.ZeroFoodWaste.model.mapper;

import com.example.ZeroFoodWaste.model.dto.D_A_FB_DTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.repository.DonationAssignmentRepository;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

    //endregion

@Mapper(componentModel = "spring")
public abstract class D_A_FBMapper {

    @Autowired
    protected DonationAssignmentRepository assignmentRepository;

    //region basic mapping

    /**
     * maps automatically all the data from the donation received
     *
     * @param donation the donation to be mapped
     * @return if the status is Available because it won't have an assignment nor a foodBank
     */
    @Mapping(target = "donationId", source = "donation.id")
    @Mapping(target = "productName", source = "donation.productName")
    @Mapping(target = "description", source = "donation.description")
    @Mapping(target = "quantity", source = "donation.quantity")
    @Mapping(target = "status", source = "donation.status")
    @Mapping(target = "createdAt", source = "donation.createdAt")

    //@AfterMapping
    @Mapping(target = "assignmentId", ignore = true)
    @Mapping(target = "foodBankId", ignore = true)
    @Mapping(target = "foodBankId", ignore = true)
    public abstract D_A_FB_DTO toDTO(Donation donation);
    //endregion

    //region afterMapping
    /**
     * receives the donation and the dto half mapped and if the status is RESERVED or COMPLETED search for the food bank
     * and assignment
     *
     * @param donation the donation to get the assignment
     * @param dto      the dto to map data
     */
    @AfterMapping
    protected void fillAsignmentAndFoodBankData(
            Donation donation,
            @MappingTarget D_A_FB_DTO dto
    ) {
        //checks the status
        if (donation.getStatus().name().equals(DonationStatus.RESERVED.name())
                || donation.getStatus().name().equals(DonationStatus.COMPLETED.name())) {
            return;
        }
        //find the assignment
        assignmentRepository.findByDonationId(donation.getId()).ifPresent(assignment -> {
            dto.setAssignmentId(assignment.getId());
            FoodBank foodBank = assignment.getFoodBank();

            //if found the assignment and food bank is not null set the data left
            if (foodBank != null) {
                dto.setFoodBankId(foodBank.getId());
                dto.setFoodBankName(foodBank.getName());
            }
        });
    }
    //endregion
}
