package com.example.ZeroFoodWaste.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DonationNotFoundException extends RuntimeException {
    public DonationNotFoundException(String status) {
        super("No Donation found with status: " + status);
    }
    public DonationNotFoundException(Long id) {
        super("No Donation found with id: " + id);
    }
}
