package com.foodstore.backend.repository;

import com.foodstore.backend.model.DetallePedido;

import java.util.List;

public interface DetallePedidoRepository extends BaseRepository<DetallePedido, Long> {

    List<DetallePedido> findByPedidoIdAndEliminadoFalse(Long pedidoId);
}