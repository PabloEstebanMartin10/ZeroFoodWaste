package com.example.ZeroFoodWaste.model.entity;

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
@Table(name = "Donations")
public class Donation {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "establishmentId", nullable = false)
    private Establishment establishment;

    @Column(nullable = false)
    private String productName;

    private String description;

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

    @OneToOne(mappedBy = "donation")
    private DonationAssignment assignment;

    public Donation(Establishment establishment, String productName, String description, String quantity, LocalDateTime expirationDate, DonationStatus status) {
        this.establishment = establishment;
        this.productName = productName;
        this.description = description;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
        this.status = status;
    }

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
