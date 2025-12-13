package com.example.ZeroFoodWaste.config;

import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.entity.Donation;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.enums.DonationStatus;
import com.example.ZeroFoodWaste.model.enums.Role;
import com.example.ZeroFoodWaste.repository.DonationRepository;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import com.example.ZeroFoodWaste.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final EstablishmentRepository establishmentRepository;
    private final DonationRepository donationRepository;

    @Override
    public void run(String... args) {
        System.out.println("🔄 Initializing database...");

        // 1. Crear Usuarios (Establecimientos y Bancos de Alimentos) usando el Servicio
        if (establishmentRepository.count() == 0) {
            createEstablishments();
            createFoodBanks();
        } else {
            System.out.println("ℹ️ Users already exist. Skipping creation.");
        }

        // 2. Crear Donaciones (solo si no existen)
        if (donationRepository.count() == 0) {
            createDonations();
        } else {
            System.out.println("ℹ️ Donations already exist. Skipping creation.");
        }

        System.out.println("✅ Database population finished.");
    }

    // ===========================================
    //              ESTABLISHMENTS
    // ===========================================
    private void createEstablishments() {
        createEstablishment(
                "estab1@example.com",
                "Supermercado A",
                "Calle Falsa 123",
                "555-1111",
                "09:00-21:00",
                "Hola soy descripcion"

        );

        createEstablishment(
                "estab2@example.com",
                "Panadería B",
                "Avenida Central 456",
                "555-2222",
                "07:00-19:00",
                "Hola soy descripcion"
        );
    }

    private void createEstablishment(String email, String name, String address, String phone, String hours, String description) {
        try {
            NewUserDTO dto = new NewUserDTO();
            dto.setEmail(email);
            dto.setPassword("pass123");
            dto.setRole(Role.Establishment);

            dto.setEstablishmentName(name);
            dto.setEstablishmentAddress(address);
            dto.setEstablishmentContactPhone(phone);
            dto.setDescription(description);

            userService.createUser(dto);
            System.out.println("✅ Created Establishment: " + email);
        } catch (Exception e) {
            System.out.println("⚠ Skipped existing user: " + email);
        }
    }

    // ===========================================
    //                FOOD BANKS
    // ===========================================
    private void createFoodBanks() {
        createFoodBank(
                "foodbank1@example.com",
                "Banco de Alimentos Norte",
                "Avenida Siempre Viva 1",
                "555-3333",
                "09:00 - 17:00",
                "Banco principal zona norte"
        );

        createFoodBank(
                "foodbank2@example.com",
                "Banco de Alimentos Sur",
                "Calle Principal 2",
                "555-4444",
                "10:00 - 14:00",
                "Sucursal pequeña zona sur"
        );
    }

    private void createFoodBank(String email, String name, String address, String phone, String hours, String desc) {
        try {
            NewUserDTO dto = new NewUserDTO();
            dto.setEmail(email);
            dto.setPassword("pass123");
            dto.setRole(Role.FoodBank);

            dto.setFoodBankName(name);
            dto.setFoodBankAddress(address);
            dto.setFoodBankContactPhone(phone);
            // Asegúrate de que tu NewUserDTO tenga estos setters. Si no, quítalos.
            dto.setDescription(desc);

            userService.createUser(dto);
            System.out.println("✅ Created FoodBank: " + email);
        } catch (Exception e) {
            System.out.println("⚠ Skipped existing user: " + email);
        }
    }

    // ===========================================
    //                DONATIONS
    // ===========================================
    private void createDonations() {
        try {
            // Recuperamos los establecimientos de la BD para asignarles las donaciones
            List<Establishment> establishments = establishmentRepository.findAll();

            if (establishments.size() < 2) {
                System.out.println("⚠ Not enough establishments to create donations.");
                return;
            }

            Establishment e1 = establishments.get(0); // Supermercado A
            Establishment e2 = establishments.get(1); // Panadería B

            Donation d1 = new Donation(e1, "Pan fresco", "Pan recién horneado", 50, "unidades",
                    LocalDateTime.now().plusDays(2), DonationStatus.AVAILABLE);

            Donation d2 = new Donation(e2, "Leche", "Leche entera fresca", 30, "litros",
                    LocalDateTime.now().plusDays(4), DonationStatus.AVAILABLE);

            Donation d3 = new Donation(e1, "Frutas", "Manzanas y plátanos", 100, "kg",
                    LocalDateTime.now().plusDays(3), DonationStatus.AVAILABLE);

            Donation d4 = new Donation(e2, "Pan integral", "Pan integral recién horneado", 40, "unidades",
                    LocalDateTime.now().plusDays(2), DonationStatus.AVAILABLE);

            donationRepository.save(d1);
            donationRepository.save(d2);
            donationRepository.save(d3);
            donationRepository.save(d4);

            System.out.println("✅ Created 4 sample donations.");

        } catch (Exception e) {
            System.out.println("❌ Error creating donations: " + e.getMessage());
        }
    }
}