package com.example.ZeroFoodWaste.config;

import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.enums.Role;
import com.example.ZeroFoodWaste.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String... args) {

        System.out.println("🔄 Initializing database with sample users...");

        createEstablishments();
        createFoodBanks();

        System.out.println("✅ Database pre-populated successfully.");
    }


    // ===========================================
    //               ESTABLISHMENTS
    // ===========================================
    private void createEstablishments() {
        createEstablishment(
                "estab1@example.com",
                "Supermercado A",
                "Calle Falsa 123",
                "555-1111",
                "9:00-21:00"
        );

        createEstablishment(
                "estab2@example.com",
                "Panadería B",
                "Avenida Central 456",
                "555-2222",
                "7:00-19:00"
        );
    }

    private void createEstablishment(String email, String name, String address, String phone, String hours) {
        try {
            NewUserDTO dto = new NewUserDTO();
            dto.setEmail(email);
            dto.setPassword("pass123");
            dto.setRole(Role.Establishment);

            dto.setEstablishmentName(name);
            dto.setEstablishmentAddress(address);
            dto.setEstablishmentContactPhone(phone);
            dto.setOpeningHours(hours);

            userService.createUser(dto);
        } catch (Exception ignored) {
            System.out.println("⚠ User already exists, skipped: " + email);
        }
    }


    // ===========================================
    //                 FOOD BANKS
    // ===========================================
    private void createFoodBanks() {
        createFoodBank(
                "foodbank1@example.com",
                "Banco de Alimentos Norte",
                "Avenida Siempre Viva 1",
                "555-3333",
                "Zona Norte"
        );

        createFoodBank(
                "foodbank2@example.com",
                "Banco de Alimentos Sur",
                "Calle Principal 2",
                "555-4444",
                "Zona Sur"
        );
    }

    private void createFoodBank(String email, String name, String address, String phone, String coverage) {
        try {
            NewUserDTO dto = new NewUserDTO();
            dto.setEmail(email);
            dto.setPassword("pass123");
            dto.setRole(Role.FoodBank);

            dto.setFoodBankName(name);
            dto.setFoodBankAddress(address);
            dto.setFoodBankContactPhone(phone);
            dto.setCoverageArea(coverage);

            userService.createUser(dto);
        } catch (Exception ignored) {
            System.out.println("⚠ User already exists, skipped: " + email);
        }
    }
}
