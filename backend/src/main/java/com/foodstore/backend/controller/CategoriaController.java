package com.foodstore.backend.controller;

import com.foodstore.backend.dto.CategoriaCreate;
import com.foodstore.backend.dto.CategoriaDto;
import com.foodstore.backend.dto.CategoriaEdit;
import com.foodstore.backend.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Categorías", description = "Gestión de categorías de productos")
@RestController
@RequestMapping("/api/categories")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @Operation(summary = "Crear categoría", description = "Crea una nueva categoría en el catálogo")
    @PostMapping
    public ResponseEntity<CategoriaDto> create(@Valid @RequestBody CategoriaCreate dto) {
        CategoriaDto created = categoriaService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Listar categorías", description = "Obtiene todas las categorías activas")
    @GetMapping
    public ResponseEntity<List<CategoriaDto>> findAll() {
        return ResponseEntity.ok(categoriaService.findAll());
    }

    @Operation(summary = "Obtener categoría por ID", description = "Obtiene una categoría activa por su identificador")
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.findById(id));
    }

    @Operation(summary = "Actualizar categoría", description = "Actualiza los datos de una categoría existente")
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaEdit dto
    ) {
        return ResponseEntity.ok(categoriaService.update(id, dto));
    }

    @Operation(summary = "Eliminar categoría", description = "Realiza soft delete de una categoría")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}