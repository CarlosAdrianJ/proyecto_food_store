package com.foodstore.backend.repository;

import com.foodstore.backend.exception.ResourceNotFoundException;
import com.foodstore.backend.model.Base;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<T extends Base> extends JpaRepository<T, Long> {

    default T findByIdOrThrow(Long id) {
        return findById(id).orElseThrow(
                () -> new ResourceNotFoundException("No se encontró la entidad con id: " + id)
        );
    }
}
