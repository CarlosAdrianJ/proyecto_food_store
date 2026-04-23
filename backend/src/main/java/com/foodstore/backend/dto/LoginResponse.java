package com.foodstore.backend.dto;

import com.foodstore.backend.model.Rol;

public record LoginResponse(
        Long id,
        String nombre,
        String apellido,
        String email,
        Rol rol
) {
}