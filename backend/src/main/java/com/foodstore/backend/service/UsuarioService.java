package com.foodstore.backend.service;

import com.foodstore.backend.dto.LoginResponse;
import com.foodstore.backend.dto.UsuarioCreate;
import com.foodstore.backend.dto.UsuarioDto;
import com.foodstore.backend.dto.UsuarioEdit;
import com.foodstore.backend.exception.BusinessException;
import com.foodstore.backend.model.Rol;
import com.foodstore.backend.model.Usuario;
import com.foodstore.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordService passwordService;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordService passwordService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordService = passwordService;
    }

    @Transactional
    public UsuarioDto create(UsuarioCreate dto) {
        String emailNormalizado = normalizarEmail(dto.email());

        if (usuarioRepository.existsByEmailAndEliminadoFalse(emailNormalizado)) {
            throw new BusinessException("Ya existe un usuario con ese email");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(normalizarTexto(dto.nombre()));
        usuario.setApellido(normalizarTexto(dto.apellido()));
        usuario.setEmail(emailNormalizado);
        usuario.setPassword(passwordService.hashPassword(dto.password()));
        usuario.setTelefono(normalizarNullable(dto.telefono()));
        usuario.setDireccion(normalizarNullable(dto.direccion()));
        usuario.setRol(dto.rol() != null ? dto.rol() : Rol.USUARIO);

        Usuario saved = usuarioRepository.save(usuario);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDto> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDto findById(Long id) {
        Usuario usuario = usuarioRepository.findByIdOrThrow(id);
        return toDto(usuario);
    }

    @Transactional
    public UsuarioDto update(Long id, UsuarioEdit dto) {
        Usuario usuario = usuarioRepository.findByIdOrThrow(id);
        String emailNormalizado = normalizarEmail(dto.email());

        Optional<Usuario> existente = usuarioRepository.findByEmailAndEliminadoFalse(emailNormalizado);

        if (existente.isPresent() && !existente.get().getId().equals(id)) {
            throw new BusinessException("Ya existe un usuario con ese email");
        }

        usuario.setNombre(normalizarTexto(dto.nombre()));
        usuario.setApellido(normalizarTexto(dto.apellido()));
        usuario.setEmail(emailNormalizado);
        usuario.setTelefono(normalizarNullable(dto.telefono()));
        usuario.setDireccion(normalizarNullable(dto.direccion()));
        usuario.setRol(dto.rol() != null ? dto.rol() : Rol.USUARIO);

        Usuario updated = usuarioRepository.save(usuario);
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        usuarioRepository.findByIdOrThrow(id);
        usuarioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Usuario findEntityByEmail(String email) {
        return usuarioRepository.findByEmailAndEliminadoFalse(normalizarEmail(email))
                .orElseThrow(() -> new BusinessException("Credenciales inválidas"));
    }

    @Transactional(readOnly = true)
    public LoginResponse toLoginResponse(Usuario usuario) {
        return new LoginResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }

    private UsuarioDto toDto(Usuario usuario) {
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