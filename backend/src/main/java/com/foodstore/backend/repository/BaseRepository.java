package com.foodstore.backend.repository;

import com.foodstore.backend.exception.ResourceNotFoundException;
import com.foodstore.backend.model.Base;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<E extends Base, ID> extends JpaRepository<E, ID> {

    List<E> findAllByEliminadoFalse();

    Optional<E> findByIdAndEliminadoFalse(ID id);

    @Override
    default List<E> findAll() {
        return findAllByEliminadoFalse();
    }

    @Override
    default Optional<E> findById(ID id) {
        return findByIdAndEliminadoFalse(id);
    }

    default E findByIdOrThrow(ID id) {
        return findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Entidad con id " + id + " no encontrado"
                ));
    }

    @Override
    @Transactional
    default void deleteById(ID id) {
        E entity = findByIdOrThrow(id);
        entity.setEliminado(true);
        save(entity);
    }
}