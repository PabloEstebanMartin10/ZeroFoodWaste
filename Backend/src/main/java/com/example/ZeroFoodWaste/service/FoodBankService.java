//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.exception.FoodBankNotFoundException;
import com.example.ZeroFoodWaste.model.dto.FoodBankResponseDTO;
import com.example.ZeroFoodWaste.model.entity.FoodBank;
import com.example.ZeroFoodWaste.model.mapper.FoodBankResponseMapper;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

//endregion

@Service
@RequiredArgsConstructor
public class FoodBankService {
    /* todos
    todo 5 validar campos de entrada con javax.validation (@NotBlank, @Valid en controller)
     */

    private final FoodBankRepository foodBankRepository;
    private final FoodBankResponseMapper foodBankResponseMapper;
    //region get

    /**
     * search and retrieves a food bank by its id
     *
     * @param id the id of the food bank
     * @return retrieves the food bank if found
     * @throws FoodBankNotFoundException if cant find the food bank
     */
    public FoodBankResponseDTO getFoodBank(Long id){
        return foodBankResponseMapper.toDTO(foodBankRepository.findById(id).orElseThrow(
                ()->new FoodBankNotFoundException(id)));
    }

    //endregion

    //region post
    @Transactional
    public FoodBankResponseDTO createFoodBank(FoodBank foodBank){
        return foodBankResponseMapper.toDTO(foodBankRepository.save(foodBank));
    }
    //endregion

    //region put/patch

    /**
     * receives a food bank, search it on the database and modify the properties, then save on DB
     *
     * @param id
     * @param dto is the object with the  properties modified
     * @return the food bank after modification
     * @throws  FoodBankNotFoundException if cant find the food bank
     */
    @Transactional
    public FoodBankResponseDTO modifyFoodBank(Long id,FoodBankResponseDTO dto){
        FoodBank foodBank = foodBankRepository.findById(id).orElseThrow(
                ()->new FoodBankNotFoundException(id));
        foodBankResponseMapper.updateEntityFromDTO(dto,foodBank);
        return foodBankResponseMapper.toDTO(foodBankRepository.save(foodBank));
    }

    //endregion

}
