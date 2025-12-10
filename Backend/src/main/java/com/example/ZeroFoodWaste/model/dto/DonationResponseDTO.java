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
    private Integer quantity;
    private LocalDateTime expirationDate;
    private String status;
}
