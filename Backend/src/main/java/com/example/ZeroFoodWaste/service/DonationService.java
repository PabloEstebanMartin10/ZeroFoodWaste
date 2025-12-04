//region imports
package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.DonationAssignment;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.repository.DonationAssignmentRepository;
import com.example.ZeroFoodWaste.repository.DonationRepository;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.IllegalMutationQueryException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
//endregion

@Service
@RequiredArgsConstructor
public class DonationService {
    /* todos
    todo 1 crear DTOs para creación, modificación y respuesta (DonationDTO, CreateDonationDTO, UpdateDonationDTO)
    todo 2 implementar un mapper (MapStruct) para evitar BeanUtils y construir entidades correctamente
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

    //region get

    /**
     * Obtains the list of donations with a specific status
     *
     * @param statusStr determines the status we search for
     *                  transforms into {@link DonationStatus}
     * @return List<Donation> returns all donations with the status specified
     */
    public List<Donation> getDonations(String statusStr) {
        DonationStatus status = DonationStatus.valueOf(statusStr.trim().toUpperCase());
        return donationRepository.findByStatus(status);
    }

    /**
     * Obtains a specific donation by donation id
     *
     * @param id donation id to search for a specific donation
     * @return the donation if found
     * @throws NoSuchElementException if it can't find the donation
     */
    public Donation getDonation(Long id) throws NoSuchElementException {
        return donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
    }
    //endregion

    //region post

    /**
     * todo pasar a dto y mapper
     *  Creates a donation and save in the DB
     *
     * @param establishmentId transforms into {@link Establishment} establishment that created the donation
     * @param productName     String with the name of the product
     * @param description     String with a description of the product(optional)
     * @param quantity        String that specifies quantity and uds,kg, etc.
     * @param expirationDate  LocalDateTime that specifies the expiration date
     * @param status          transforms into {@link DonationStatus} to select the status of the donation
     * @return Donation that has been created
     */
    public Donation createDonation(Long establishmentId, String productName, String description, String quantity, LocalDateTime expirationDate, String status) {
        Establishment establishment = establishmentRepository.findById(establishmentId).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Establishment")
        );
        DonationStatus donationStatus = DonationStatus.valueOf(status.trim().toUpperCase());
        Donation donation = new Donation(establishment, description, productName, quantity, expirationDate, donationStatus);
        return donationRepository.save(donation);
    }
    //endregion

    //region delete

    /**
     * Search a donation and delete it
     *
     * @param id id of the donation to delete
     * @return the donation deleted
     */
    public Donation deleteDonation(Long id) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        donationRepository.delete(donation);
        return donation;
    }
    //endregion

    //region put/patch

    /**
     * todo pasar a dto
     * modiifies the values of the donations
     *
     * @param id              (not modified) the donation that is modified
     * @param establishmentId (not modified) transform into {@link Establishment} to check if the establishment
     *                        modifying is the same that created the donation
     * @param productName     String with the name of the product being donated
     * @param description     (optional) String with the description of the product being donated
     * @param quantity        String with the quantity and uds,kg, etc.
     * @param expirationDate  LocalDateTime with the expiration date
     * @param status          transforms into {@link DonationStatus} specifies the status of the donation
     * @return the donation modified
     */
    public Donation modifyDonation(Long id, Long establishmentId, String productName, String description, String quantity, LocalDateTime expirationDate, String status) {
        Donation modifyDonation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        if (Objects.equals(establishmentId, modifyDonation.getEstablishment().getId())) {
            Establishment est = establishmentRepository.findById(establishmentId).orElseThrow(
                    () -> new NoSuchElementException("Couldn't find the Establishment")
            );
            DonationStatus donationStatus = DonationStatus.valueOf(status.trim().toUpperCase());
            Donation modifierDonation = new Donation(est, productName, description, quantity, expirationDate, donationStatus);
            BeanUtils.copyProperties(modifierDonation, modifyDonation, "id", "establishment", "createdAt", "updatedAt", "Assignment");
            return donationRepository.save(modifyDonation);
        } else {
            throw new IllegalMutationQueryException("Can't change a Donation its not yours");
        }
    }

    /**
     *
     * @param id         id of the donation accepted
     * @param foodBankId transform into {@link FoodBank} the food bank that accepted the donation
     * @return the donation with the status changed
     */
    public Donation acceptDonation(Long id, Long foodBankId) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        FoodBank foodBank = foodBankRepository.findById(foodBankId).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Food Bank")
        );
        DonationAssignment assignment = new DonationAssignment(donation, foodBank);
        assignmentRepository.save(assignment);
        donation.setStatus(DonationStatus.RESERVED);
        return donationRepository.save(donation);
    }

    /**
     * modifies the status of the donation selected to picked up
     *
     * @param id id of the donation to be picked up
     * @return the donation modified
     */
    public Donation pickUpDonation(Long id) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        DonationAssignment assignment = assignmentRepository.findByDonationId(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Assignment")
        );
        donation.setStatus(DonationStatus.COMPLETED);
        assignment.setPickedUpAt(LocalDateTime.now());
        assignmentRepository.save(assignment);
        return donationRepository.save(donation);
    }

    //endregion
}
