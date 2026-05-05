package com.foodstore.backend.dto;

import com.foodstore.backend.model.EstadoPedido;
import com.foodstore.backend.model.FormaPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoDto(
        Long id,
        Long usuarioId,
        String usuarioNombre,
        String usuarioEmail,
        LocalDateTime fechaPedido,
        BigDecimal total,
        EstadoPedido estado,
        FormaPago formaPago,
        List<DetallePedidoDto> detalles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long version
) {
}