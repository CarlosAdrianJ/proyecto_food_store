package com.foodstore.backend.service;

import com.foodstore.backend.dto.CategoriaCreate;
import com.foodstore.backend.dto.CategoriaDto;
import com.foodstore.backend.dto.CategoriaEdit;
import com.foodstore.backend.exception.BusinessException;
import com.foodstore.backend.model.Categoria;
import com.foodstore.backend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public CategoriaDto create(CategoriaCreate dto) {
        String denominacionNormalizada = normalizar(dto.denominacion());

        if (categoriaRepository.existsByDenominacionIgnoreCaseAndEliminadoFalse(denominacionNormalizada)) {
            throw new BusinessException("Ya existe una categoría con esa denominacion");
        }

        Categoria categoria = new Categoria();
        categoria.setDenominacion(denominacionNormalizada);
        categoria.setDescripcion(normalizarDescripcion(dto.descripcion()));

        Categoria saved = categoriaRepository.save(categoria);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoriaDto> findAll() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDto findById(Long id) {
        Categoria categoria = categoriaRepository.findByIdOrThrow(id);
        return toDto(categoria);
    }

    @Transactional
    public CategoriaDto update(Long id, CategoriaEdit dto) {
        Categoria categoria = categoriaRepository.findByIdOrThrow(id);
        String denominacionNormalizada = normalizar(dto.denominacion());

        Optional<Categoria> existente = categoriaRepository
                .findByDenominacionIgnoreCaseAndEliminadoFalse(denominacionNormalizada);

        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new BusinessException("Ya existe una categoría con esa denominacion");
        }

        categoria.setDenominacion(denominacionNormalizada);
        categoria.setDescripcion(normalizarDescripcion(dto.descripcion()));

        Categoria updated = categoriaRepository.save(categoria);
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        categoriaRepository.findByIdOrThrow(id);
        categoriaRepository.deleteById(id);
    }

    private CategoriaDto toDto(Categoria categoria) {
        return new CategoriaDto(
                categoria.getId(),
                categoria.getDenominacion(),
                categoria.getDescripcion(),
                categoria.getCreatedAt(),
                categoria.getUpdatedAt(),
                categoria.getVersion()
        );
    }

    private String normalizar(String valor) {
        return valor == null ? null : valor.trim();
    }

    private String normalizarDescripcion(String valor) {
        if (valor == null) {
            return null;
        }

        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }
}