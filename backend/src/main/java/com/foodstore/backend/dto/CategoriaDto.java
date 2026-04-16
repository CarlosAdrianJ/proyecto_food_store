package com.foodstore.backend.dto;

import java.time.LocalDateTime;

public record CategoriaDto(
        Long id,
        String denominacion,
        String descripcion,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long version
) {
}
