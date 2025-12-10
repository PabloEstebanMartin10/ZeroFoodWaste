package com.example.ZeroFoodWaste.config;

import com.example.ZeroFoodWaste.model.entity.*;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.model.enums.Role;
import com.example.ZeroFoodWaste.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final EstablishmentRepository establishmentRepository;
    private final FoodBankRepository foodBankRepository;
    private final DonationRepository donationRepository;
    private final DonationAssignmentRepository donationAssignmentRepository;

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() > 0) {
            System.out.println("ℹ️ DataLoader: datos ya existentes, no se cargarán datos nuevos.");
            return;
        }

        // ---------- USERS ----------
        User estabUser1 = new User(null, "estab1@example.com", "pass123", Role.Establishment);
        User estabUser2 = new User(null, "estab2@example.com", "pass123", Role.Establishment);
        User fbUser1 = new User(null, "foodbank1@example.com", "pass123", Role.FoodBank);
        User fbUser2 = new User(null, "foodbank2@example.com", "pass123", Role.FoodBank);

        userRepository.save(estabUser1);
        userRepository.save(estabUser2);
        userRepository.save(fbUser1);
        userRepository.save(fbUser2);

        // ---------- ESTABLISHMENTS ----------
        Establishment e1 = new Establishment(null, estabUser1, "Supermercado A", "Calle Falsa 123", "555-1111", "9:00-21:00", new ArrayList<>());
        Establishment e2 = new Establishment(null, estabUser2, "Panadería B", "Avenida Central 456", "555-2222", "7:00-19:00", new ArrayList<>());

        establishmentRepository.save(e1);
        establishmentRepository.save(e2);

        // ---------- FOOD BANKS ----------
        FoodBank fb1 = new FoodBank(null, fbUser1, "Banco de Alimentos Norte", "Avenida Siempre Viva 1", "555-3333", "Zona Norte", new ArrayList<>());
        FoodBank fb2 = new FoodBank(null, fbUser2, "Banco de Alimentos Sur", "Calle Principal 2", "555-4444", "Zona Sur", new ArrayList<>());

        foodBankRepository.save(fb1);
        foodBankRepository.save(fb2);

        // ---------- DONATIONS ----------
        Donation d1 = new Donation(
                e1,
                "Pan fresco",
                "Pan recién horneado del día",
                50,
                "Kg",
                LocalDateTime.now().plusDays(2),
                DonationStatus.AVAILABLE
        );

        Donation d2 = new Donation(
                e2,
                "Leche",
                "Leche entera fresca",
                30,
                "Litros",
                LocalDateTime.now().plusDays(4),
                DonationStatus.AVAILABLE
        );

        Donation d3 = new Donation(
                e1,
                "Bollería",
                "Croissants y napolitanas",
                20,
                "unidades",
                LocalDateTime.now().plusDays(1),
                DonationStatus.AVAILABLE
        );

        Donation d4 = new Donation(
                e2,
                "Yogur",
                "Yogures naturales",
                25,
                "Kg",
                LocalDateTime.now().plusDays(3),
                DonationStatus.AVAILABLE
        );

        donationRepository.save(d1);
        donationRepository.save(d2);
        donationRepository.save(d3);
        donationRepository.save(d4);

        // ---------- DONATIONS ASSIGNMENTS ----------
        DonationAssignment da1 = new DonationAssignment(d1, fb1);
        DonationAssignment da2 = new DonationAssignment(d2, fb2);

        donationAssignmentRepository.save(da1);
        donationAssignmentRepository.save(da2);

        System.out.println("✅ Database pre-populated with test data");
    }
}
