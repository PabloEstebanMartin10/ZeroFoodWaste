//region imports
package com.example.ZeroFoodWaste.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
//endregion

@Service
@RequiredArgsConstructor
public class DonationService {
    /* todos
    todo 3 factorizar un método genérico findOrThrow(id, exception) para Donation, Establishment y FoodBank
    todo 4 crear excepciones específicas (DonationNotFoundException, EstablishmentNotFoundException,
            FoodBankNotFoundException, DonationPermissionException, AssignmentNotFoundException)
    todo 5 evitar devolver entidades JPA directamente → devolver DTOs en todos los métodos públicos
    todo 6 añadir @Transactional a métodos que modifican BD (create, modify, delete, accept, pickUp)
    todo 7 refactorizar modifyDonation para no crear una entidad nueva, usar DTO y mapper
    todo 8 validar parámetros de entrada con javax.validation y @Valid (especialmente fechas, status y quantities)
    todo 9 revisar integridad referencial en DonationAssignment (evitar duplicados o inconsistencias)
    */

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
                () -> new NoSuchElementException("Couldn't find the Donation")
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
    public DonationResponseDTO createDonation(NewDonationDTO dto) {
        Donation donation = newDonationMapper.toEntity(dto);
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
    public DonationResponseDTO deleteDonation(Long id) throws NoSuchElementException {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
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
    public DonationResponseDTO modifyDonation(DonationResponseDTO dto) {
        Donation donation = donationRepository.findById(dto.getId())
                .orElseThrow(() -> new NoSuchElementException("Donation not found"));
        donationResponseMapper.updateEntityFromDTO(dto, donation);
        Donation saved = donationRepository.save(donation);
        return donationResponseMapper.toDTO(saved);
    }

    /**
     *
     * @param id         id of the donation accepted
     * @param foodBankId transform into {@link FoodBank} the food bank that accepted the donation
     * @return the updated donation mapped to a response DTO
     */
    public DonationResponseDTO acceptDonation(Long id, Long foodBankId) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        FoodBank foodBank = foodBankRepository.findById(foodBankId).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Food Bank")
        );
        DonationAssignment assignment = new DonationAssignment(donation, foodBank);
        assignmentRepository.save(assignment);
        donation.setStatus(DonationStatus.RESERVED);
        return donationResponseMapper.toDTO(donationRepository.save(donation));
    }

    /**
     * modifies the status of the donation selected to picked up
     *
     * @param id id of the donation to be picked up
     * @return the updated donation mapped to a response DTO
     */
    public DonationResponseDTO pickUpDonation(Long id) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        DonationAssignment assignment = assignmentRepository.findByDonationId(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Assignment")
        );
        donation.setStatus(DonationStatus.COMPLETED);
        assignment.setPickedUpAt(LocalDateTime.now());
        assignmentRepository.save(assignment);
        return donationResponseMapper.toDTO(donationRepository.save(donation));
    }

    //endregion
}
