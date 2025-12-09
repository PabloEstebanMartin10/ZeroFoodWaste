package com.example.ZeroFoodWaste.model.dto;

import lombok.Data;

@Data
public class EstablishmentResponseDTO {
    private Long userId;
    private Long establishmentId;
    private String name;
    private String address;
    private String contactPhone;
    private String openingHours;
}
