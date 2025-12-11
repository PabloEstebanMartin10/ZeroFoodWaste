package com.example.ZeroFoodWaste.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class EstablishmentNotFoundException extends RuntimeException {
    public EstablishmentNotFoundException(Long id) {
        super("No establishment found with id: " + id);
    }
}
