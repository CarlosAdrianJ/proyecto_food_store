package com.foodstore.backend.dto;

import com.foodstore.backend.model.Rol;

import java.time.LocalDateTime;

public record UsuarioDto(
        Long id,
        String nombre,
        String apellido,
        String email,
        String telefono,
        String direccion,
        Rol rol,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long version
) {
}