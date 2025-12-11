package com.example.ZeroFoodWaste.controller;

import com.example.ZeroFoodWaste.model.dto.DonationResponseDTO;
import com.example.ZeroFoodWaste.model.dto.NewDonationDTO;
import com.example.ZeroFoodWaste.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class DonationController {
    private final DonationService donationService;

    @GetMapping("/donations")
    public ResponseEntity<List<DonationResponseDTO>> getDonationsByStatus(@RequestParam String status) {
        List<DonationResponseDTO> responseDTOS = donationService.getDonationsByStatus(status);
        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/donations/establishment/{id}")
    public ResponseEntity<List<DonationResponseDTO>> getDonationsByEstablishment(@PathVariable Long id) {
        List<DonationResponseDTO> responseDTOS = donationService.getDonationsByEstablishment(id);
        return ResponseEntity.ok(responseDTOS);
    }

    @GetMapping("/donations/{id}")
    public ResponseEntity<DonationResponseDTO> getDonation(@PathVariable Long id) {
        DonationResponseDTO dto = donationService.getDonation(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/donations")
    public ResponseEntity<DonationResponseDTO> createDonation(@RequestBody NewDonationDTO donation) {
        DonationResponseDTO dto = donationService.createDonation(donation);
        URI location = URI.create("donations/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @PostMapping("/donations/{id}/accept/{foodBankId}")
    public ResponseEntity<DonationResponseDTO> acceptDonation(@PathVariable Long id, @PathVariable Long foodBankId) {
        DonationResponseDTO dto = donationService.acceptDonation(id,foodBankId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/donations/{id}/pickup")
    public ResponseEntity<DonationResponseDTO> pickUpDonation(@PathVariable Long id) {
        //todo
        DonationResponseDTO dto = donationService.pickUpDonation(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/donations/reserved")
    public ResponseEntity<List<DonationResponseDTO>> getReservedDonations(@RequestParam Long foodBankId) {
        List<DonationResponseDTO> responseDTOS = donationService.getReservedDonationsByBank(foodBankId);
        return ResponseEntity.ok(responseDTOS);
    }

    @PostMapping("/donations/{id}/cancel/{foodBankId}")
    public ResponseEntity<DonationResponseDTO> cancelReservation(
            @PathVariable Long id,
            @PathVariable Long foodBankId) {
        DonationResponseDTO dto = donationService.cancelReservation(id, foodBankId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/donations/{id}")
    public ResponseEntity<DonationResponseDTO> modifyDonation(@RequestBody DonationResponseDTO donation) {
        //todo
        DonationResponseDTO dto = donationService.modifyDonation(donation);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/donations/{id}")
    public ResponseEntity<DonationResponseDTO> deleteDonation(@PathVariable Long id) {
        //todo
        DonationResponseDTO dto = donationService.deleteDonation(id);
        return ResponseEntity.ok(dto);
    }
}
