package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.DonationAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonationAssignmentRepository extends JpaRepository<DonationAssignment,Long> {
    Optional<DonationAssignment> findByDonationId(Long donationId);
    List<DonationAssignment> findByFoodBankId(Long foodBankId);
}
