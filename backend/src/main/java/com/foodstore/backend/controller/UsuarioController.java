package com.foodstore.backend.controller;

import com.foodstore.backend.dto.UsuarioCreate;
import com.foodstore.backend.dto.UsuarioDto;
import com.foodstore.backend.dto.UsuarioEdit;
import com.foodstore.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Operation(summary = "Crear usuario", description = "Registra un nuevo usuario en el sistema")
    @PostMapping
    public ResponseEntity<UsuarioDto> create(@Valid @RequestBody UsuarioCreate dto) {
        UsuarioDto created = usuarioService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios activos")
    @GetMapping
    public ResponseEntity<List<UsuarioDto>> findAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @Operation(summary = "Obtener usuario por ID", description = "Obtiene un usuario activo por su identificador")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioEdit dto
    ) {
        return ResponseEntity.ok(usuarioService.update(id, dto));
    }

    @Operation(summary = "Eliminar usuario", description = "Realiza soft delete de un usuario")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}