package com.foodstore.backend.service;

import com.foodstore.backend.dto.LoginRequest;
import com.foodstore.backend.dto.LoginResponse;
import com.foodstore.backend.dto.RegisterRequest;
import com.foodstore.backend.dto.UsuarioDto;
import com.foodstore.backend.exception.BusinessException;
import com.foodstore.backend.model.Rol;
import com.foodstore.backend.model.Usuario;
import com.foodstore.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordService passwordService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordService = passwordService;
    }

    @Transactional
    public UsuarioDto register(RegisterRequest request) {
        String emailNormalizado = normalizarEmail(request.email());

        if (usuarioRepository.existsByEmailAndEliminadoFalse(emailNormalizado)) {
            throw new BusinessException("Ya existe un usuario con ese email");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(normalizarTexto(request.nombre()));
        usuario.setApellido(normalizarTexto(request.apellido()));
        usuario.setEmail(emailNormalizado);
        usuario.setPassword(passwordService.hashPassword(request.password()));
        usuario.setTelefono(normalizarNullable(request.telefono()));
        usuario.setDireccion(normalizarNullable(request.direccion()));
        usuario.setRol(Rol.USUARIO);

        Usuario saved = usuarioRepository.save(usuario);

        return toUsuarioDto(saved);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String emailNormalizado = normalizarEmail(request.email());

        Usuario usuario = usuarioRepository.findByEmailAndEliminadoFalse(emailNormalizado)
                .orElseThrow(() -> new BusinessException("Credenciales inválidas"));

        boolean passwordValida = passwordService.matches(request.password(), usuario.getPassword());

        if (!passwordValida) {
            throw new BusinessException("Credenciales inválidas");
        }

        return new LoginResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }

    private UsuarioDto toUsuarioDto(Usuario usuario) {
        return new UsuarioDto(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getDireccion(),
                usuario.getRol(),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt(),
                usuario.getVersion()
        );
    }

    private String normalizarTexto(String valor) {
        return valor == null ? null : valor.trim();
    }

    private String normalizarNullable(String valor) {
        if (valor == null) {
            return null;
        }

        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}