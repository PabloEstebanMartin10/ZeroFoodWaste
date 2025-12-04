//region imports

package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.FoodBank;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

//endregion

@Service
@RequiredArgsConstructor
public class FoodBankService {
/* todos
    todo 1 añadir @transactional
    todo 2 excepciones personalizadas
    todo 3 dtos para no usar entities
    todo 4 cambiar el mapper de beanUtils
     */

    private final FoodBankRepository foodBankRepository;

    //region get

    /**
     * search and retrieves a food bank by its id
     *
     * @param userId the id of the food bank
     * @return retrieves the food bank if found
     * @throws NoSuchElementException if cant find the food bank
     */
    public FoodBank getFoodBank(Long userId){
        return foodBankRepository.findByUserId(userId).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the food bank"));
    }

    //endregion

    //region put/patch

    /**
     * receives a food bank, search it on the database and modify the properties, then save on DB
     *
     * @param fb is the object with the  properties modified
     * @return the food bank after modification
     * @throws  NoSuchElementException if cant find the food bank
     */
    public FoodBank modifyFoodBank(FoodBank fb){
        FoodBank foodBank = foodBankRepository.findById(fb.getId()).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the food bank"));
        BeanUtils.copyProperties(fb,foodBank,"id","user", "assignments");
        return foodBankRepository.save(foodBank);
    }

    //endregion

}
