package com.foodstore.backend.config;

import com.foodstore.backend.model.Rol;
import com.foodstore.backend.model.Usuario;
import com.foodstore.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserLoad implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String nombre;
    private final String apellido;
    private final String email;
    private final String password;
    private final String telefono;
    private final String direccion;

    public UserLoad(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.nombre:Admin}") String nombre,
            @Value("${app.admin.apellido:Principal}") String apellido,
            @Value("${app.admin.email:admin@admin.com}") String email,
            @Value("${app.admin.password:123456}") String password,
            @Value("${app.admin.telefono:}") String telefono,
            @Value("${app.admin.direccion:}") String direccion
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() != 0) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setNombre(nombre);
        admin.setApellido(apellido);
        admin.setEmail(email.trim().toLowerCase());
        admin.setPassword(passwordEncoder.encode(password));
        admin.setTelefono(telefono);
        admin.setDireccion(direccion);
        admin.setRol(Rol.ADMIN);

        usuarioRepository.save(admin);

        log.info("Usuario administrador creado: {}", admin.getEmail());
    }
}