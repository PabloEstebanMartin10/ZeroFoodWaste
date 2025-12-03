package com.example.ZeroFoodWaste.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "DonationAssignments")
public class DonationAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "donationId", nullable = false)
    private Donation donation;

    @ManyToOne
    @JoinColumn(name = "foodBankId", nullable = false)
    private FoodBank foodBank;

    @Column(nullable = false)
    private LocalDateTime acceptedAt;

    private LocalDateTime pickedUpAt;

    public DonationAssignment(Donation donation, FoodBank foodBank) {
        this.donation = donation;
        this.foodBank = foodBank;
    }

    @PrePersist
    public void prePersist(){
        acceptedAt = LocalDateTime.now();
    }
}
