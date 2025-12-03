//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.Establishment;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

//endregion

@Service
@RequiredArgsConstructor
public class EstablishmentService {
    /* todos
    todo 1 añadir @transactional
    todo 2 excepciones personalizadas
    todo 3 dtos para no usar entities
    todo 4 cambiar el mapper de beanUtils
     */
    private final EstablishmentRepository establishmentRepository;

    //region get

    /**
     * Retrieves an establishment associated with a specific user ID.
     *
     * @param userId the ID of the user whose establishment is to be retrieved
     * @return the {@link Establishment} linked to the user
     * @throws NoSuchElementException if no establishment is found for the given user ID
     */
    public Establishment getEstablishment(Long userId){
        return establishmentRepository.findByUserId(userId).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the establishment"));
    }

    //endregion

    //region put/patch

    /**
     * Updates an existing establishment with new values.
     * Only the fields allowed for modification will be updated; ID and user association are not changed.
     *
     * @param est an {@link Establishment} object containing the new values
     * @return the updated {@link Establishment} after saving the changes
     * @throws NoSuchElementException if the establishment with the given ID does not exist
     */
    public Establishment modifyEstablishment(Establishment est){
        Establishment establishment = establishmentRepository.findById(est.getId()).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the establishment")
        );
        BeanUtils.copyProperties(est,establishment,"id","user","donations");
        return establishmentRepository.save(establishment);
    }

    //endregion
}
