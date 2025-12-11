//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.config.JwtUtils;
import com.example.ZeroFoodWaste.model.dto.LoginResponseDTO;
import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.dto.UserResponseDTO;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.entity.User;
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
     todo 2 crear excepciones personalizadas (UserNotFoundException, InvalidCredentialsException)
     todo 3 introducir DTOs para evitar exponer entidades directamente
     todo 5 validar datos de entrada con javax.validation (e.g. @Email, @NotBlank)
     todo 6 encriptar password en createUser antes de guardar
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
        User user = newUserMapper.toEntity(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);

        if (user.getEstablishment() != null) {
            Establishment est = user.getEstablishment();
            est.setUser(user);
            establishmentService.createEstablishment(est);
        }else if (user.getFoodBank() != null) {
            FoodBank foodBank = user.getFoodBank();
            foodBank.setUser(user);
            foodBankService.createFoodBank(foodBank);
        }
        return userResponseMapper.toDTO(user) ;
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

    /**
     *  receives a user and a hash of the password if is all correct returns the user
     *
     * @param email the email of the user
     * @param rawPassword a hash of the password from the user
     * @return the user if the information is correct
     * @throws NoSuchElementException if the user is not found
     */
    public LoginResponseDTO LoginUser(String email, String rawPassword) {
        User user = userRepository.findByEmailAndPasswordHash(email, rawPassword).orElseThrow(
                () -> new NoSuchElementException("Invalid user or password "));
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            //todo throws
        }
        String token = jwtUtils.generateToken(user.getEmail());

        return new LoginResponseDTO(token,userResponseMapper.toDTO(user));
    }

    //endregion

}
