package com.example.ZeroFoodWaste.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "FoodBanks")
public class FoodBank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "foodBank")
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String contactPhone;

    // --- NUEVOS CAMPOS AÑADIDOS ---
    @Column(nullable = false, columnDefinition = "TEXT")
    private String openingHours; // Para guardar el horario JSON

    @Column(nullable = false)
    private String description;
    // -----------------------------

    @OneToMany(mappedBy = "foodBank")
    private List<DonationAssignment> assignments;
}
