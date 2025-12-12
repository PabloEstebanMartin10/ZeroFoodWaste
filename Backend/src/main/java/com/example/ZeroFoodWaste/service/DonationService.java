//region imports
package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.exception.AssignmentNotFoundException;
import com.example.ZeroFoodWaste.exception.DonationAlreadyReserved;
import com.example.ZeroFoodWaste.exception.DonationNotFoundException;
import com.example.ZeroFoodWaste.exception.FoodBankNotFoundException;
import com.example.ZeroFoodWaste.model.dto.DonationResponseDTO;
import com.example.ZeroFoodWaste.model.dto.NewDonationDTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.DonationAssignment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.model.mapper.DonationResponseMapper;
import com.example.ZeroFoodWaste.model.mapper.NewDonationMapper;
import com.example.ZeroFoodWaste.repository.DonationAssignmentRepository;
import com.example.ZeroFoodWaste.repository.DonationRepository;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
//endregion
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    //region repositories
    private final DonationRepository donationRepository;
    private final EstablishmentRepository establishmentRepository;
    private final FoodBankRepository foodBankRepository;
    private final DonationAssignmentRepository assignmentRepository;
    //endregion

    //region mappers
    private final NewDonationMapper newDonationMapper;
    private final DonationResponseMapper donationResponseMapper;
    //endregion

    //region get

    /**
     * Obtains the list of donations with a specific status
     *
     * @param statusStr determines the status we search for
     *                  transforms into {@link DonationStatus}
     * @return List<DonationResponseDTO> returns a list of the donations by status
     */
    public List<DonationResponseDTO> getDonationsByStatus(String statusStr) {
        DonationStatus status = DonationStatus.valueOf(statusStr.trim().toUpperCase());
        return donationResponseMapper.toDTOList(donationRepository.findByStatus(status));
    }

    public List<DonationResponseDTO> getReservedDonationsByBank(Long foodBankId) {
    return assignmentRepository.findByFoodBankId(foodBankId)
        .stream()
        .map(assignment -> {
            Donation donation = assignment.getDonation();
            DonationResponseDTO dto = donationResponseMapper.toDTO(donation);
            dto.setAssignmentId(assignment.getId());
            return dto;
        })
        .collect(Collectors.toList());
    }

    public List<DonationResponseDTO> getDonationsByFoodBank(Long foodBankId) {
        // 1. Buscamos en el repositorio usando el ID del banco
        List<Donation> donations = donationRepository.findByAssignment_FoodBank_Id(foodBankId);
        
        // 2. Convertimos la lista de Entidades a DTOs usando el mapper
        // Si tu mapper tiene un método toDTOList úsalo, si no, usa stream:
        return donations.stream()
                .map(donationResponseMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * receives an establishment id and search all the donations from that establishment
     *
     * @param establishmentId determines the establishment that created the donations searched
     * @return List<DonationResponseDTO>  returns a list of the donations from the establishment
     */
    public List<DonationResponseDTO> getDonationsByEstablishment(Long establishmentId) {
        List<Donation> donations = donationRepository.findAllByEstablishmentId(establishmentId);
        return donationResponseMapper.toDTOList(donations);
    }

    /**
     * Obtains a specific donation by donation id
     *
     * @param id donation id to search for a specific donation
     * @return DonationResponseDTO with the donation data
     * @throws NoSuchElementException if it can't find the donation
     */
    public DonationResponseDTO getDonation(Long id) throws NoSuchElementException {
        return donationResponseMapper.toDTO(donationRepository.findById(id).orElseThrow(
                () -> new DonationNotFoundException("Couldn't find a donation with id: "+id)
        ));
    }
    //endregion

    //region post

    /**
     * receives a new donation dto, map it to a donation entity and then retrieves the donation if saved
     *
     * @param dto dto the DTO containing the donation data to be saved
     * @return the saved {@link DonationResponseDTO} entity with updated fields (id, createdAt, etc.)
     */
    @Transactional
    public DonationResponseDTO createDonation(NewDonationDTO dto) {
        Donation donation = newDonationMapper.toEntity(dto);
        return donationResponseMapper.toDTO(donationRepository.save(donation));
    }

    /**
     *
     * @param donationId id of the donation accepted
     * @param foodBankId transform into {@link FoodBank} the food bank that accepted the donation
     * @return the updated donation mapped to a response DTO
     */
    @Transactional
    public DonationResponseDTO acceptDonation(Long donationId, Long foodBankId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new DonationNotFoundException("Couldn't find a donation with id: "+donationId));

        // Comprueba si ya tiene asignación
        if (donation.getAssignment() != null) {
            throw new DonationAlreadyReserved("Donation is already reserved");
        }

        FoodBank foodBank = foodBankRepository.findById(foodBankId)
                .orElseThrow(() -> new FoodBankNotFoundException(foodBankId));

        // Crear y guardar nueva asignación
        DonationAssignment assignment = new DonationAssignment(donation, foodBank);
        assignmentRepository.save(assignment);

        donation.setAssignment(assignment);
        donation.setStatus(DonationStatus.RESERVED);

        return donationResponseMapper.toDTO(donationRepository.save(donation));
    }


    /**
     * modifies the status of the donation selected to picked up
     *
     * @param id id of the donation to be picked up
     * @return the updated donation mapped to a response DTO
     */
    @Transactional
    public DonationResponseDTO pickUpDonation(Long id) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new DonationNotFoundException("Couldn't find a Donation with id: "+id)
        );
        DonationAssignment assignment = assignmentRepository.findByDonationId(id).orElseThrow(
                () -> new AssignmentNotFoundException("Couldn't find the Assignment with donationId: "+id)
        );
        donation.setStatus(DonationStatus.COMPLETED);
        assignment.setPickedUpAt(LocalDateTime.now());
        assignmentRepository.save(assignment);
        return donationResponseMapper.toDTO(donationRepository.save(donation));
    }

    @Transactional
    public DonationResponseDTO cancelReservation(Long donationId, Long foodBankId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new DonationNotFoundException("Couldn't find a donation with id: "+donationId +
                        " & foodbankId: "+ foodBankId));

        DonationAssignment assignment = donation.getAssignment();
        if (assignment == null || !assignment.getFoodBank().getId().equals(foodBankId)) {
            throw new AssignmentNotFoundException("Assignment is null or couldn't find an assignment with foodbankId: "+
                    foodBankId);
        }

        // Eliminar la asignación de la base de datos
        assignmentRepository.delete(assignment);

        // Actualizar estado de la donación
        donation.setAssignment(null);
        donation.setStatus(DonationStatus.AVAILABLE);

        return donationResponseMapper.toDTO(donationRepository.save(donation));
    }
    //endregion

    //region delete

    /**
     * Search a donation and delete it
     *
     * @param id id of the donation to delete
     * @return DonationResponseDTO
     */
    @Transactional
    public DonationResponseDTO deleteDonation(Long id) throws NoSuchElementException {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new DonationNotFoundException("Couldn't find a Donation with id: "+id)
        );
        donationRepository.delete(donation);
        return donationResponseMapper.toDTO(donation);
    }
    //endregion

    //region put/patch

    /**
     * modifies a donation from the database with the data from th dto
     *
     * @param dto the DTO containing the updated donation data; must include the donation ID
     * @return the updated donation mapped to a response DTO
     * @throws NoSuchElementException if no donation exists with the given ID
     */
    @Transactional
    public DonationResponseDTO modifyDonation(DonationResponseDTO dto) {
        Donation donation = donationRepository.findById(dto.getId())
                .orElseThrow(() -> new DonationNotFoundException("Couldn't find a Donation with id: "+dto.getId()));
        donationResponseMapper.updateEntityFromDTO(dto, donation);
        Donation saved = donationRepository.save(donation);
        return donationResponseMapper.toDTO(saved);
    }

    //endregion
}
