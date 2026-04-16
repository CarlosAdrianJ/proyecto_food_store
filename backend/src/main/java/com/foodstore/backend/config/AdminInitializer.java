package com.foodstore.backend.config;

import com.foodstore.backend.model.Rol;
import com.foodstore.backend.model.Usuario;
import com.foodstore.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdminUser(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.nombre:Admin}") String nombre,
            @Value("${app.admin.apellido:Principal}") String apellido,
            @Value("${app.admin.email:admin@foodstore.com}") String email,
            @Value("${app.admin.password:Admin1234}") String password,
            @Value("${app.admin.telefono:}") String telefono,
            @Value("${app.admin.direccion:}") String direccion
    ) {
        return args -> {
            boolean adminExiste = usuarioRepository.existsByRolAndEliminadoFalse(Rol.ADMIN);
            boolean emailExiste = usuarioRepository.existsByEmailAndEliminadoFalse(email);

            if (!adminExiste && !emailExiste) {
                Usuario admin = new Usuario();
                admin.setNombre(nombre);
                admin.setApellido(apellido);
                admin.setEmail(email);
                admin.setPassword(passwordEncoder.encode(password));
                admin.setTelefono(telefono);
                admin.setDireccion(direccion);
                admin.setRol(Rol.ADMIN);

                usuarioRepository.save(admin);

                System.out.println("Usuario administrador inicial creado: " + email);
            }
        };
    }
}