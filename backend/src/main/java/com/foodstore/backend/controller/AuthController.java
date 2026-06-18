package com.foodstore.backend.controller;

import com.foodstore.backend.dto.LoginRequest;
import com.foodstore.backend.dto.LoginResponse;
import com.foodstore.backend.dto.RegisterRequest;
import com.foodstore.backend.dto.UsuarioDto;
import com.foodstore.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Autenticación", description = "Registro e inicio de sesión de usuarios")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Registrar usuario", description = "Crea una cuenta nueva de usuario")
    @PostMapping("/register")
    public ResponseEntity<UsuarioDto> register(@Valid @RequestBody RegisterRequest request) {
        UsuarioDto created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario con email y contraseña")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}