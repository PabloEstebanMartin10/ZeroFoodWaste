package com.example.ZeroFoodWaste.repository;

import com.example.ZeroFoodWaste.model.Donation;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation,Long> {
  List<Donation> findByStatus(DonationStatus status);
}
