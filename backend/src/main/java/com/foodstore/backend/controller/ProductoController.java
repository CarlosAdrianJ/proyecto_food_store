package com.foodstore.backend.controller;

import com.foodstore.backend.dto.ProductoCreate;
import com.foodstore.backend.dto.ProductoDto;
import com.foodstore.backend.dto.ProductoEdit;
import com.foodstore.backend.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Productos", description = "Gestión y consulta de productos")
@RestController
@RequestMapping("/api/products")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @Operation(summary = "Crear producto", description = "Crea un nuevo producto en el catálogo")
    @PostMapping
    public ResponseEntity<ProductoDto> create(@Valid @RequestBody ProductoCreate dto) {
        ProductoDto created = productoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Listar productos", description = "Obtiene todos los productos activos")
    @GetMapping
    public ResponseEntity<List<ProductoDto>> findAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @Operation(summary = "Obtener producto por ID", description = "Obtiene un producto activo por su identificador")
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    @Operation(summary = "Listar productos por categoría", description = "Obtiene productos activos de una categoría")
    @GetMapping("/category/{idCategory}")
    public ResponseEntity<List<ProductoDto>> findByCategory(@PathVariable Long idCategory) {
        return ResponseEntity.ok(productoService.findByCategory(idCategory));
    }

    @Operation(summary = "Actualizar producto", description = "Actualiza los datos de un producto existente")
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductoEdit dto
    ) {
        return ResponseEntity.ok(productoService.update(id, dto));
    }

    @Operation(summary = "Eliminar producto", description = "Realiza soft delete de un producto")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar catálogo", description = "Obtiene productos disponibles para la tienda")
    @GetMapping("/catalog")
    public ResponseEntity<List<ProductoDto>> findCatalog() {
        return ResponseEntity.ok(productoService.findCatalog());
    }

    @Operation(summary = "Obtener producto del catálogo", description = "Obtiene un producto disponible por ID")
    @GetMapping("/catalog/{id}")
    public ResponseEntity<ProductoDto> findCatalogById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findCatalogById(id));
    }

    @Operation(summary = "Listar catálogo por categoría", description = "Obtiene productos disponibles filtrados por categoría")
    @GetMapping("/catalog/category/{idCategory}")
    public ResponseEntity<List<ProductoDto>> findCatalogByCategory(@PathVariable Long idCategory) {
        return ResponseEntity.ok(productoService.findCatalogByCategory(idCategory));
    }
}