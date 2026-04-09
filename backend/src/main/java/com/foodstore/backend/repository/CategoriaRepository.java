package com.foodstore.backend.repository;

import com.foodstore.backend.model.Categoria;

import java.util.Optional;

public interface CategoriaRepository extends BaseRepository<Categoria> {

    Optional<Categoria> findByDenominacionIgnoreCaseAndEliminadoFalse(String denominacion);

    boolean existsByDenominacionIgnoreCaseAndEliminadoFalse(String denominacion);
}