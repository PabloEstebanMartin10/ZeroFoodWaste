//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.User;
import com.example.ZeroFoodWaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

//endregion

@Service
@RequiredArgsConstructor
public class UserService {
    /* todos
     todo 1 añadir @Transactional en métodos que escriben en la BD
     todo 2 crear excepciones personalizadas (UserNotFoundException, InvalidCredentialsException)
     todo 3 introducir DTOs para evitar exponer entidades directamente
     todo 4 reemplazar BeanUtils por MapStruct u otro mapper tipado
     todo 5 validar datos de entrada con javax.validation (e.g. @Email, @NotBlank)
     todo 6 encriptar password en createUser antes de guardar
     todo 7 manejar duplicados al registrar (email ya registrado)
      */
     private final UserRepository userRepository;

     //region post

     /**
      * saves a new user to the DB
      *
      * @param user the user to be saved
      * @return the user if is saved
      */
    public User createUser(User user) {
        return  userRepository.save(user);
    }

    /**
     *  receives a user and a hash of the password if is all correct returns the user
     *
     * @param email the email of the user
     * @param passwordHash a hash of the password from the user
     * @return the user if the information is correct
     * @throws NoSuchElementException if the user is not found
     */
    public User LoginUser(String email, String passwordHash) {
        return userRepository.findByEmailAndPasswordHash(email, passwordHash).orElseThrow(
                () -> new NoSuchElementException("Invalid user or password "));
    }

    //endregion

}
