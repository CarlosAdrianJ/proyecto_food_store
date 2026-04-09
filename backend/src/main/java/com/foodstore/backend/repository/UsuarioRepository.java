package com.foodstore.backend.repository;

import com.foodstore.backend.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends BaseRepository<Usuario> {

    Optional<Usuario> findByEmailAndEliminadoFalse(String email);

    boolean existsByEmailAndEliminadoFalse(String email);
}