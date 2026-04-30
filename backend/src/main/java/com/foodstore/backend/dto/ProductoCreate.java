package com.foodstore.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductoCreate(

        @NotBlank(message = "La denominacion es obligatoria")
        @Size(max = 150, message = "La denominacion no puede superar los 150 caracteres")
        String denominacion,

        @Size(max = 500, message = "La descripcion no puede superar los 500 caracteres")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal precio,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        @NotNull(message = "La disponibilidad es obligatoria")
        Boolean disponible,

        @Size(max = 500, message = "La imagenUrl no puede superar los 500 caracteres")
        String imagenUrl,

        @NotNull(message = "La categoria es obligatoria")
        Long categoriaId
) {
}