package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation,Long> {
  List<Donation> findByStatus(DonationStatus status);
  List<Donation> findAllByEstablishmentId(Long establishmentId);
  List<Donation> findByAssignmentId(Long foodBankId);
}
