package com.foodstore.backend.repository;

import com.foodstore.backend.model.Producto;

import java.util.List;

public interface ProductoRepository extends BaseRepository<Producto> {

    List<Producto> findByCategoriaIdAndEliminadoFalse(Long categoriaId);

    List<Producto> findByDisponibleTrueAndEliminadoFalse();

    List<Producto> findByCategoriaIdAndDisponibleTrueAndEliminadoFalse(Long categoriaId);
}
