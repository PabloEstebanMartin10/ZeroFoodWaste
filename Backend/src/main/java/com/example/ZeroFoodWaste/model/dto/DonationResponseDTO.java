package com.example.ZeroFoodWaste.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DonationResponseDTO {
    private Long id;
    private Long establishmentId;
    private Long assignmentId;
    private String productName;
    private String description;
    private Number quantity;
    private String unit;
    private LocalDateTime expirationDate;
    private String status;
}
