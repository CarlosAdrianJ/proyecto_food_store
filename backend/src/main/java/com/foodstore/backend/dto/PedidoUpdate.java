package com.foodstore.backend.dto;

import com.foodstore.backend.model.EstadoPedido;
import com.foodstore.backend.model.FormaPago;
import jakarta.validation.constraints.NotNull;

public record PedidoUpdate(

        @NotNull(message = "El estado es obligatorio")
        EstadoPedido estado,

        @NotNull(message = "La forma de pago es obligatoria")
        FormaPago formaPago
) {
}