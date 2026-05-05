package com.foodstore.backend.dto;

import com.foodstore.backend.model.FormaPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record PedidoCreate(

        @NotNull(message = "El usuarioId es obligatorio")
        Long usuarioId,

        @NotNull(message = "La forma de pago es obligatoria")
        FormaPago formaPago,

        @NotEmpty(message = "El pedido debe tener al menos un detalle")
        List<@Valid DetallePedidoCreate> detalles
) {
}