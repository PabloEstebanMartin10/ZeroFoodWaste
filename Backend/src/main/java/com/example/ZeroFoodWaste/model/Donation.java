package com.example.ZeroFoodWaste.model;

import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "establishmentId", nullable = false)
    private Establishment establishment;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String quantity;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    private String photoUrl;

    @Column(nullable = false)
    private DonationStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate(){
        updatedAt = LocalDateTime.now();
    }
}
