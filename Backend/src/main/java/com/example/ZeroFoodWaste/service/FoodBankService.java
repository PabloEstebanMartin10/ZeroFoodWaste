package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.FoodBank;
import com.example.ZeroFoodWaste.repository.FoodBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class FoodBankService {
    private final FoodBankRepository foodBankRepository;

    public FoodBank getFoodBank(Long userId){
        return foodBankRepository.findByUserId(userId).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the food bank"));
    }

    public FoodBank modifyFoodBank(FoodBank fb){
        FoodBank foodBank = foodBankRepository.findById(fb.getId()).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the food bank"));
        BeanUtils.copyProperties(fb,foodBank,"id","user", "assignments");
        return foodBankRepository.save(foodBank);
    }

}
