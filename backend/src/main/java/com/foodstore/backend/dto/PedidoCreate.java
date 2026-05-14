package com.foodstore.backend.dto;

import com.foodstore.backend.model.FormaPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PedidoCreate(
        @NotNull(message = "El usuarioId es obligatorio")
        Long usuarioId,

        @NotNull(message = "La forma de pago es obligatoria")
        FormaPago formaPago,

        @NotBlank(message = "El teléfono de entrega es obligatorio")
        @Size(max = 30, message = "El teléfono no puede superar los 30 caracteres")
        String telefonoEntrega,

        @NotBlank(message = "La dirección de entrega es obligatoria")
        @Size(max = 255, message = "La dirección no puede superar los 255 caracteres")
        String direccionEntrega,

        @Size(max = 500, message = "Las notas no pueden superar los 500 caracteres")
        String notasAdicionales,

        @NotEmpty(message = "El pedido debe tener al menos un detalle")
        List<@Valid DetallePedidoCreate> detalles
) {
}