package com.foodstore.backend.repository;

import com.foodstore.backend.model.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends BaseRepository<Producto> {

    List<Producto> findByCategoriaIdAndEliminadoFalse(Long categoriaId);

    List<Producto> findByDisponibleTrueAndEliminadoFalse();

    List<Producto> findByCategoriaIdAndDisponibleTrueAndEliminadoFalse(Long categoriaId);

    Optional<Producto> findByIdAndDisponibleTrueAndEliminadoFalse(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Producto p WHERE p.id = :id AND p.eliminado = false")
    Optional<Producto> findByIdForUpdate(@Param("id") Long id);
}