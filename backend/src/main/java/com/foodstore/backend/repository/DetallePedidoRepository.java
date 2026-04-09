package com.foodstore.backend.repository;

import com.foodstore.backend.model.DetallePedido;

import java.util.List;

public interface DetallePedidoRepository extends BaseRepository<DetallePedido> {

    List<DetallePedido> findByPedidoIdAndEliminadoFalse(Long pedidoId);
}