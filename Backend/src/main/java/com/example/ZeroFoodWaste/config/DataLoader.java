package com.example.ZeroFoodWaste.config;

import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.entity.User;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.model.enums.Role;
import com.example.ZeroFoodWaste.repository.DonationRepository;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import com.example.ZeroFoodWaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final EstablishmentRepository establishmentRepository;
    private final FoodBankRepository foodBankRepository;
    private final DonationRepository donationRepository;

    @Override
    public void run(String... args) throws Exception {
        // ---------- USERS ----------
        User estabUser1 = new User(null, "estab1@example.com", "pass123", Role.Establishment);
        User estabUser2 = new User(null, "estab2@example.com", "pass123", Role.Establishment);
        User fbUser1 = new User(null, "foodbank1@example.com", "pass123", Role.foodBank);
        User fbUser2 = new User(null, "foodbank2@example.com", "pass123", Role.foodBank);

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
                LocalDateTime.now().plusDays(2),
                DonationStatus.AVAILABLE
        );

        Donation d2 = new Donation(
                e2,
                "Leche",
                "Leche entera fresca",
                30,
                LocalDateTime.now().plusDays(4),
                DonationStatus.AVAILABLE
        );

        Donation d3 = new Donation(
                e1,
                "Bollería",
                "Croissants y napolitanas",
                20,
                LocalDateTime.now().plusDays(1),
                DonationStatus.AVAILABLE
        );

        Donation d4 = new Donation(
                e2,
                "Yogur",
                "Yogures naturales",
                25,
                LocalDateTime.now().plusDays(3),
                DonationStatus.AVAILABLE
        );

        donationRepository.save(d1);
        donationRepository.save(d2);
        donationRepository.save(d3);
        donationRepository.save(d4);


        System.out.println("✅ Database pre-populated with test data");
    }
}
