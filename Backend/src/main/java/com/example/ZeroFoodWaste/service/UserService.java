//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.config.JwtUtils;
import com.example.ZeroFoodWaste.model.dto.LoginResponseDTO;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

//endregion

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    /* todos
     todo 1 crear excepciones personalizadas básicas (UserNotFoundException, InvalidCredentialsException)
     todo 2 validar datos de entrada esenciales con javax.validation (e.g. @Email, @NotBlank) en DTOs
     todo 3 manejar duplicados al registrar con excepción personalizada (EmailAlreadyExistsException)
     todo 4 integrar login para que devuelva LoginResponseDTO con token + UserResponseDTO
     todo 5 documentar métodos públicos con Javadoc
          */
     private final UserRepository userRepository;
     private final NewUserMapper newUserMapper;
     private final UserResponseMapper userResponseMapper;
     private final EstablishmentService establishmentService;
     private final FoodBankService foodBankService;
     private final PasswordEncoder passwordEncoder;
     private final JwtUtils jwtUtils;

     //region post

     /**
      * saves a new user to the DB
      *
      * @param dto the user to be saved
      * @return the user if is saved
      */
     @Transactional
    public UserResponseDTO createUser(NewUserDTO dto) {
         if (userRepository.existsByEmail(dto.getEmail())) {
             throw new IllegalArgumentException("Email already registered");
         }

         User user = newUserMapper.toEntity(dto);
         user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

         if (user.getRole() == Role.Establishment) {
             Establishment est = new Establishment();
             est.setName(dto.getEstablishmentName());
             est.setContactPhone(dto.getEstablishmentContactPhone());
             user.setEstablishment(est);
         }

         if (user.getRole() == Role.FoodBank) {
             FoodBank fb = new FoodBank();
             fb.setName(dto.getFoodBankName());
             fb.setContactPhone(dto.getFoodBankContactPhone());
             user.setFoodBank(fb);
         }

         User saved = userRepository.save(user);
        return userResponseMapper.toDTOWithoutPass(saved) ;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().toString()) // USER, ADMIN, etc
                .build();
    }

    public UserResponseDTO getByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        UserResponseDTO userResponse = userResponseMapper.toDTO(user);

        return userResponse;
    }

    //endregion

}
