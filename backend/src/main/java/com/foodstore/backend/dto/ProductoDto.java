package com.foodstore.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductoDto(
        Long id,
        String denominacion,
        String descripcion,
        BigDecimal precio,
        Integer stock,
        Boolean disponible,
        String imagenUrl,
        Long categoriaId,
        String categoriaDenominacion,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long version
) {
}