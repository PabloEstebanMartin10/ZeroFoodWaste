package com.example.ZeroFoodWaste.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FoodBankNotFoundException extends RuntimeException {
    public FoodBankNotFoundException(Long id) {
        super("No food bank found with id: "+id);
    }
}
