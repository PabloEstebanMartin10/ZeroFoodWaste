package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.Donation;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {
    private final DonationRepository donationRepository;

    public List<Donation> getDonations(String statusStr) {
        if (statusStr == null || statusStr.isEmpty()) {
            return donationRepository.findAll();
        }

    }
}
