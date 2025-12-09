package com.example.ZeroFoodWaste.controller;

import com.example.ZeroFoodWaste.model.dto.FoodBankResponseDTO;
import com.example.ZeroFoodWaste.service.FoodBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/foodbank")
@RequiredArgsConstructor
public class FoodBankController {
    private final FoodBankService foodBankService;

    //region get
    @GetMapping("/{id}")
    public ResponseEntity<FoodBankResponseDTO> getFoodBank(@PathVariable Long id) {
        return ResponseEntity.ok(foodBankService.getFoodBank(id));
    }
    //endregion

    //region put/patch
    @PatchMapping("/{id}")
    public ResponseEntity<FoodBankResponseDTO> modifyFoodBank(@PathVariable Long id, @RequestBody FoodBankResponseDTO foodBankResponseDTO) {
        return ResponseEntity.ok(foodBankService.modifyFoodBank(id, foodBankResponseDTO));
    }
    //endregion

}
