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


        // ---------------- USERS + ESTABLISHMENTS ----------------
        User estabUser1 = new User();
        estabUser1.setEmail("estab1@example.com");
        estabUser1.setPasswordHash(passwordEncoder.encode("pass123"));
        estabUser1.setRole(Role.Establishment);

        Establishment e1 = new Establishment();
        e1.setName("Supermercado A");
        e1.setAddress("Calle Falsa 123");
        e1.setContactPhone("555-1111");
        e1.setOpeningHours("9:00-21:00");
        e1.setUser(estabUser1);       // relación bidireccional
        estabUser1.setEstablishment(e1);

        User estabUser2 = new User();
        estabUser2.setEmail("estab2@example.com");
        estabUser2.setPasswordHash(passwordEncoder.encode("pass123"));
        estabUser2.setRole(Role.Establishment);

        Establishment e2 = new Establishment();
        e2.setName("Panadería B");
        e2.setAddress("Avenida Central 456");
        e2.setContactPhone("555-2222");
        e2.setOpeningHours("7:00-19:00");
        e2.setUser(estabUser2);
        estabUser2.setEstablishment(e2);

        userRepository.save(estabUser1);
        userRepository.save(estabUser2);

        // ---------------- USERS + FOODBANKS ----------------
        User fbUser1 = new User();
        fbUser1.setEmail("foodbank1@example.com");
        fbUser1.setPasswordHash(passwordEncoder.encode("pass123"));
        fbUser1.setRole(Role.FoodBank);

        FoodBank fb1 = new FoodBank();
        fb1.setName("Banco de Alimentos Norte");
        fb1.setAddress("Avenida Siempre Viva 1");
        fb1.setContactPhone("555-3333");
        fb1.setOpeningHours("7:00-19:00");
        fb1.setDescription("Banco de alimentos principal de la zona norte."); // También description si lo pusiste not-null
        fb1.setUser(fbUser1);
        fbUser1.setFoodBank(fb1);

        User fbUser2 = new User();
        fbUser2.setEmail("foodbank2@example.com");
        fbUser2.setPasswordHash(passwordEncoder.encode("pass123"));
        fbUser2.setRole(Role.FoodBank);

        FoodBank fb2 = new FoodBank();
        fb2.setName("Banco de Alimentos Sur");
        fb2.setAddress("Calle Principal 2");
        fb2.setContactPhone("555-4444");
        fb2.setOpeningHours("7:00-19:00");
        fb2.setDescription("Banco de alimentos principal de la zona norte."); // También description si lo pusiste not-null
        fb2.setUser(fbUser2);
        fbUser2.setFoodBank(fb2);

        userRepository.save(fbUser1);
        userRepository.save(fbUser2);

        // ---------------- DONATIONS ----------------
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

        // ---------------- DONATION ASSIGNMENTS ----------------
        // DonationAssignment assign1 = new DonationAssignment();
        // assign1.setDonation(d1);
        // assign1.setFoodBank(fb1);
        // d1.setAssignment(assign1);

        // DonationAssignment assign2 = new DonationAssignment();
        // assign2.setDonation(d2);
        // assign2.setFoodBank(fb2);
        // d2.setAssignment(assign2);

        // donationRepository.save(d1);
        // donationRepository.save(d2);

        System.out.println("✅ Database pre-populated with test data");
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
