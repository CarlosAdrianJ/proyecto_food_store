package com.foodstore.backend.service;

import com.foodstore.backend.dto.ProductoCreate;
import com.foodstore.backend.dto.ProductoDto;
import com.foodstore.backend.dto.ProductoEdit;
import com.foodstore.backend.exception.ResourceNotFoundException;
import com.foodstore.backend.model.Categoria;
import com.foodstore.backend.model.Producto;
import com.foodstore.backend.repository.CategoriaRepository;
import com.foodstore.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository,
                           CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public ProductoDto create(ProductoCreate dto) {
        Categoria categoria = categoriaRepository.findByIdOrThrow(dto.categoriaId());

        Producto producto = new Producto();
        producto.setDenominacion(normalizar(dto.denominacion()));
        producto.setDescripcion(normalizarNullable(dto.descripcion()));
        producto.setPrecio(dto.precio());
        producto.setStock(dto.stock());
        producto.setDisponible(dto.disponible());
        producto.setImagenUrl(normalizarNullable(dto.imagenUrl()));
        producto.setCategoria(categoria);

        Producto saved = productoRepository.save(producto);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductoDto> findAll() {
        return productoRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoDto findById(Long id) {
        Producto producto = productoRepository.findByIdOrThrow(id);
        return toDto(producto);
    }

    @Transactional(readOnly = true)
    public List<ProductoDto> findByCategory(Long categoriaId) {
        categoriaRepository.findByIdOrThrow(categoriaId);

        return productoRepository.findByCategoriaIdAndEliminadoFalse(categoriaId)
                .stream()
                .map(this::toDto)
                .toList();
    }

   
    @Transactional(readOnly = true)
    public List<ProductoDto> findCatalog() {
        return productoRepository.findByDisponibleTrueAndEliminadoFalse()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoDto findCatalogById(Long id) {
        Producto producto = productoRepository.findByIdAndDisponibleTrueAndEliminadoFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró un producto disponible con id: " + id));

        return toDto(producto);
    }

    @Transactional(readOnly = true)
    public List<ProductoDto> findCatalogByCategory(Long categoriaId) {
        categoriaRepository.findByIdOrThrow(categoriaId);

        return productoRepository.findByCategoriaIdAndDisponibleTrueAndEliminadoFalse(categoriaId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ProductoDto update(Long id, ProductoEdit dto) {
        Producto producto = productoRepository.findByIdOrThrow(id);
        Categoria categoria = categoriaRepository.findByIdOrThrow(dto.categoriaId());

        producto.setDenominacion(normalizar(dto.denominacion()));
        producto.setDescripcion(normalizarNullable(dto.descripcion()));
        producto.setPrecio(dto.precio());
        producto.setStock(dto.stock());
        producto.setDisponible(dto.disponible());
        producto.setImagenUrl(normalizarNullable(dto.imagenUrl()));
        producto.setCategoria(categoria);

        Producto updated = productoRepository.save(producto);
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        productoRepository.findByIdOrThrow(id);
        productoRepository.deleteById(id);
    }

    private ProductoDto toDto(Producto producto) {
        return new ProductoDto(
                producto.getId(),
                producto.getDenominacion(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getDisponible(),
                producto.getImagenUrl(),
                producto.getCategoria().getId(),
                producto.getCategoria().getDenominacion(),
                producto.getCreatedAt(),
                producto.getUpdatedAt(),
                producto.getVersion()
        );
    }

    private String normalizar(String valor) {
        return valor == null ? null : valor.trim();
    }

    private String normalizarNullable(String valor) {
        if (valor == null) {
            return null;
        }

        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }
}