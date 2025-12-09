package com.example.ZeroFoodWaste.controller;

import com.example.ZeroFoodWaste.model.dto.EstablishmentResponseDTO;
import com.example.ZeroFoodWaste.service.EstablishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/establishment")
@RequiredArgsConstructor
public class EstablishmentController {

    private final EstablishmentService establishmentService;

    //region get
    @GetMapping("{Id}")
    public ResponseEntity<EstablishmentResponseDTO> getEstablishment(@PathVariable Long Id) {
        return ResponseEntity.ok(establishmentService.getEstablishment(Id));
    }
    //endregion

    //region put/patch
    @PatchMapping("{id}")
    public ResponseEntity<EstablishmentResponseDTO> modifyEstablishment(@PathVariable Long id, @RequestBody EstablishmentResponseDTO dto) {
        return ResponseEntity.ok(establishmentService.modifyEstablishment(id,dto));
    }
    //endregion

}
