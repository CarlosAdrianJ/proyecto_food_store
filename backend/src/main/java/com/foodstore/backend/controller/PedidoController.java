package com.foodstore.backend.controller;

import com.foodstore.backend.dto.PedidoCreate;
import com.foodstore.backend.dto.PedidoDto;
import com.foodstore.backend.dto.PedidoUpdate;
import com.foodstore.backend.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoDto> create(@Valid @RequestBody PedidoCreate dto) {
        PedidoDto created = pedidoService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<PedidoDto>> findAll() {
        return ResponseEntity.ok(pedidoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PedidoDto>> findByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(pedidoService.findByUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDto> update(
            @PathVariable Long id,
            @Valid @RequestBody PedidoUpdate dto
    ) {
        return ResponseEntity.ok(pedidoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pedidoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}