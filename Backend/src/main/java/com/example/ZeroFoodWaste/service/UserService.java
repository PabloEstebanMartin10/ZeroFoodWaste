//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.exception.EmailAlreadyExistsException;
import com.example.ZeroFoodWaste.exception.UserNotFoundException;
import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.dto.UserResponseDTO;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.entity.User;
import com.example.ZeroFoodWaste.model.enums.Role;
import com.example.ZeroFoodWaste.model.mapper.NewUserMapper;
import com.example.ZeroFoodWaste.model.mapper.UserResponseMapper;
import com.example.ZeroFoodWaste.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

//endregion

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final NewUserMapper newUserMapper;
    private final UserResponseMapper userResponseMapper;
    private final PasswordEncoder passwordEncoder;

    //region post

    /**
     * Creates and saves a new user in the database.
     * Depending on the user's role, initializes Establishment or FoodBank entities.
     * The password is hashed before saving.
     *
     * @param dto DTO containing the new user's data, including email, password, and optionally establishment or food bank details
     * @return UserResponseDTO with the saved user's data, excluding the password
     * @throws EmailAlreadyExistsException if the email is already registered
     */
    @Transactional
    public UserResponseDTO createUser(NewUserDTO dto) throws EmailAlreadyExistsException {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = newUserMapper.toEntity(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        if (user.getRole() == Role.Establishment) {
            Establishment est = new Establishment();
            est.setName(dto.getEstablishmentName());
            est.setAddress(dto.getEstablishmentAddress());
            est.setContactPhone(dto.getEstablishmentContactPhone());
            est.setOpeningHours(dto.getOpeningHours());
            user.setEstablishment(est);
        }

        if (user.getRole() == Role.FoodBank) {
            FoodBank fb = new FoodBank();
            fb.setName(dto.getFoodBankName());
            fb.setAddress(dto.getFoodBankAddress());
            fb.setContactPhone(dto.getFoodBankContactPhone());
            fb.setCoverageArea(dto.getCoverageArea());
            user.setFoodBank(fb);
        }

        User saved = userRepository.save(user);
        return userResponseMapper.toDTOWithoutPass(saved);
    }

    /**
     * Loads a user by email for Spring Security authentication.
     * Used automatically during login.
     *
     * @param email the email of the user to authenticate
     * @return UserDetails required by Spring Security
     * @throws UserNotFoundException if no user with the given email exists
     */
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UserNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().toString()) // USER, ADMIN, etc
                .build();
    }

    /**
     * Retrieves user information by email.
     *
     * @param email the email of the user to retrieve
     * @return UserResponseDTO containing user data, excluding the password
     * @throws UserNotFoundException if no user with the given email exists
     */
    public UserResponseDTO getByEmail(String email) throws UserNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));

        return userResponseMapper.toDTO(user);
    }

    //endregion

}
