package com.example.ZeroFoodWaste.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class D_A_FB_DTO {
    private Long donationId;
    private Long assignmentId;
    private Long foodBankId;
    private String productName;
    private String description;
    private String quantity;
    private String status;
    private LocalDateTime createdAt;
    private String foodBankName;
}
