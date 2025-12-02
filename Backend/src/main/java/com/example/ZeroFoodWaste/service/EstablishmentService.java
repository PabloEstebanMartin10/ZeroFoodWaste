package com.example.ZeroFoodWaste.service;

import com.example.ZeroFoodWaste.model.Establishment;
import com.example.ZeroFoodWaste.repository.EstablishmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class EstablishmentService {
    private final EstablishmentRepository establishmentRepository;


    public Establishment getEstablishment(Long userId){
        return establishmentRepository.findByUserId(userId).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the establishment"));
    }

    public Establishment modifyEstablishment(Establishment est){
        Establishment establishment = establishmentRepository.findById(est.getId()).orElseThrow(
                ()->new NoSuchElementException("Couldn't find the establishment")
        );
        BeanUtils.copyProperties(est,establishment,"id","user","donations");
        return establishmentRepository.save(establishment);
    }
}
