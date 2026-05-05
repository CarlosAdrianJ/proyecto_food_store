package com.foodstore.backend.dto;

import java.math.BigDecimal;

public record DetallePedidoDto(
        Long id,
        Long productoId,
        String productoDenominacion,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
) {
}