//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.dto.EstablishmentResponseDTO;
import com.example.ZeroFoodWaste.model.dto.NewUserDTO;
import com.example.ZeroFoodWaste.model.entity.Establishment;
import com.example.ZeroFoodWaste.model.entity.User;
import com.example.ZeroFoodWaste.model.mapper.EstablishmentResponseMapper;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

//endregion

@Service
@RequiredArgsConstructor
public class EstablishmentService {
    /* todos
    todo 2 crear excepciones personalizadas (EstablishmentNotFoundException, InvalidUpdateException)
    todo 3 introducir DTOs para evitar exponer entidades (EstablishmentDTO, UpdateEstablishmentDTO)
    todo 5 validar entrada con javax.validation (@NotBlank, @Valid en controller)
    todo 7 evaluar si se requiere control de permisos antes de modificar establecimientos
     */
    private final EstablishmentRepository establishmentRepository;
    private final EstablishmentResponseMapper establishmentResponseMapper;

    //region get

    /**
     * Retrieves an establishment associated with a specific user ID.
     *
     * @param userId the ID of the user whose establishment is to be retrieved
     * @return the {@link EstablishmentResponseDTO} linked to the user
     * @throws NoSuchElementException if no establishment is found for the given user ID
     */
    public EstablishmentResponseDTO getEstablishment(Long userId) {
        return establishmentResponseMapper.toDTO(establishmentRepository.findByUserId(userId).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the establishment")));
    }

    //endregion

    //region post
    @Transactional
    public EstablishmentResponseDTO createEstablishment(Establishment establishment) {
        return establishmentResponseMapper.toDTO(establishmentRepository.save(establishment));
    }
    //endregion

    //region put/patch

    /**
     * Updates an existing establishment with new values.
     * Only the fields allowed for modification will be updated; ID and user association are not changed.
     *
     * @param id
     * @param dto an {@link EstablishmentResponseDTO} object containing the new values
     * @return the updated {@link EstablishmentResponseDTO} after saving the changes
     * @throws NoSuchElementException if the establishment with the given ID does not exist
     */
    @Transactional
    public EstablishmentResponseDTO modifyEstablishment(Long id, EstablishmentResponseDTO dto) {
        Establishment establishment = establishmentRepository.findById(id).orElseThrow(
                () -> new NoSuchElementException("Couldn't find the establishment")
        );
        establishmentResponseMapper.updateEntityFromDTO(dto, establishment);
        return establishmentResponseMapper.toDTO(establishmentRepository.save(establishment));
    }

    //endregion
}
