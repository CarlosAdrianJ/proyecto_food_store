package com.foodstore.backend.repository;

import com.foodstore.backend.model.Pedido;

import java.util.List;

public interface PedidoRepository extends BaseRepository<Pedido> {

    List<Pedido> findByUsuarioIdAndEliminadoFalse(Long usuarioId);
}