package com.foodstore.backend.controller;

import com.foodstore.backend.dto.ProductoCreate;
import com.foodstore.backend.dto.ProductoDto;
import com.foodstore.backend.dto.ProductoEdit;
import com.foodstore.backend.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @PostMapping
    public ResponseEntity<ProductoDto> create(@Valid @RequestBody ProductoCreate dto) {
        ProductoDto created = productoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductoDto>> findAll() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    @GetMapping("/category/{idCategory}")
    public ResponseEntity<List<ProductoDto>> findByCategory(@PathVariable Long idCategory) {
        return ResponseEntity.ok(productoService.findByCategory(idCategory));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductoEdit dto
    ) {
        return ResponseEntity.ok(productoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/catalog")
    public ResponseEntity<List<ProductoDto>> findCatalog() {
        return ResponseEntity.ok(productoService.findCatalog());
    }

    @GetMapping("/catalog/{id}")
    public ResponseEntity<ProductoDto> findCatalogById(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.findCatalogById(id));
    }

    @GetMapping("/catalog/category/{idCategory}")
    public ResponseEntity<List<ProductoDto>> findCatalogByCategory(@PathVariable Long idCategory) {
        return ResponseEntity.ok(productoService.findCatalogByCategory(idCategory));
    }
}