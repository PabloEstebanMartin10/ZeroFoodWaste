package com.example.ZeroFoodWaste.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NewDonationDTO {
    private Long establishmentId;
    private String productName;
    private String description;
    private Number quantity;
    private LocalDateTime expirationDate;
    private String status;
}
