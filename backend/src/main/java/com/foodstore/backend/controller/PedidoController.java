package com.foodstore.backend.controller;

import com.foodstore.backend.dto.PedidoCreate;
import com.foodstore.backend.dto.PedidoDto;
import com.foodstore.backend.dto.PedidoUpdate;
import com.foodstore.backend.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pedidos", description = "Gestión de pedidos del sistema")
@RestController
@RequestMapping("/api/orders")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @Operation(summary = "Crear pedido", description = "Crea un nuevo pedido con sus detalles")
    @PostMapping
    public ResponseEntity<PedidoDto> create(@Valid @RequestBody PedidoCreate dto) {
        PedidoDto created = pedidoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Listar pedidos", description = "Obtiene todos los pedidos activos")
    @GetMapping
    public ResponseEntity<List<PedidoDto>> findAll() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @Operation(summary = "Obtener pedido por ID", description = "Obtiene un pedido activo por su identificador")
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findById(id));
    }

    @Operation(summary = "Listar pedidos por usuario", description = "Obtiene los pedidos activos de un usuario")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PedidoDto>> findByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(pedidoService.findByUser(userId));
    }

    @Operation(summary = "Actualizar pedido", description = "Actualiza estado y forma de pago de un pedido")
    @PutMapping("/{id}")
    public ResponseEntity<PedidoDto> update(
            @PathVariable Long id,
            @Valid @RequestBody PedidoUpdate dto
    ) {
        return ResponseEntity.ok(pedidoService.update(id, dto));
    }

    @Operation(summary = "Eliminar pedido", description = "Realiza soft delete de un pedido")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}