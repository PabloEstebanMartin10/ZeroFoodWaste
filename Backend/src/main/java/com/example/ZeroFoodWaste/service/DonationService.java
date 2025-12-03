package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.Donation;
import com.example.ZeroFoodWaste.model.DonationAssignment;
import com.example.ZeroFoodWaste.model.Establishment;
import com.example.ZeroFoodWaste.model.FoodBank;
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

@Service
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;
    private final EstablishmentRepository establishmentRepository;
    private final FoodBankRepository foodBankRepository;
    private final DonationAssignmentRepository assignmentRepository;

    public List<Donation> getDonations(String statusStr) {
        DonationStatus status = DonationStatus.valueOf(statusStr.trim().toUpperCase());
        return donationRepository.findByStatus(status);
    }

    //todo pasar a dto y mapper
    public Donation createDonation(Long establishmentId, String productName, String quantity, LocalDateTime expirationDate, String status) {
        Establishment establishment = establishmentRepository.findById(establishmentId).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Establishment")
        );
        DonationStatus donationStatus = DonationStatus.valueOf(status.trim().toUpperCase());
        Donation donation = new Donation(establishment, productName, quantity, expirationDate, donationStatus);
        return donationRepository.save(donation);
    }

    public Donation getDonation(Long id) {
        return donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
    }

    //todo pasar a dto
    public Donation modifyDonation(Long id, Long establishmentId, String productName, String quantity, LocalDateTime expirationDate, String status) {
        Donation modifyDonation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        if (Objects.equals(establishmentId, modifyDonation.getEstablishment().getId())) {
            Establishment est = establishmentRepository.findById(establishmentId).orElseThrow(
                    () -> new NoSuchElementException("Couldn't find the Establishment")
            );
            DonationStatus donationStatus = DonationStatus.valueOf(status.trim().toUpperCase());
            Donation modifierDonation = new Donation(est, productName, quantity, expirationDate, donationStatus);
            BeanUtils.copyProperties(modifierDonation, modifyDonation, "id", "establishment", "createdAt", "updatedAt", "Assignment");
            return donationRepository.save(modifyDonation);
        } else {
            throw new IllegalMutationQueryException("Can't change a Donation its not yours");
        }
    }

    public Donation deleteDonation(Long id){
        Donation donation = donationRepository.findById(id).orElseThrow(
                ()-> new NoSuchElementException("Couldn't find the Donation")
        );
        donationRepository.delete(donation);
        return donation;
    }


    public Donation acceptDonation(Long id,Long foodBankId) {
        Donation donation = donationRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Donation")
        );
        FoodBank foodBank = foodBankRepository.findById(foodBankId).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the Food Bank")
        );
        DonationAssignment assignment = new DonationAssignment(donation,foodBank);
        assignmentRepository.save(assignment);
        donation.setStatus(DonationStatus.ACCEPTED);
        return donationRepository.save(donation);
    }

    public Donation pickUpDonation(Long id){
        Donation donation = donationRepository.findById(id).orElseThrow(
                ()-> new NoSuchElementException("Couldn't find the Donation")
        );
        DonationAssignment assignment = assignmentRepository.findByDonationId(id).orElseThrow(
                ()-> new NoSuchElementException("Couldn't find the Assignment")
        );
        donation.setStatus(DonationStatus.PICKED_UP);
        assignment.setPickedUpAt(LocalDateTime.now());
        assignmentRepository.save(assignment);
        return donationRepository.save(donation);
    }
}
