package com.foodstore.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaEdit(

        @NotBlank(message = "La denominacion es obligatoria")
        @Size(max = 100, message = "La denominacion no puede superar los 100 caracteres")
        String denominacion,

        @Size(max = 255, message = "La descripcion no puede superar los 255 caracteres")
        String descripcion
) {
}