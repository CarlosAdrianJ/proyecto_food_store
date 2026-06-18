package com.foodstore.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder(10);
    }

    @Test
    void encode_generaHashBcryptDiferenteCadaVez() {
        String password = "password123";

        String hash1 = passwordEncoder.encode(password);
        String hash2 = passwordEncoder.encode(password);

        assertNotEquals(hash1, hash2);

        assertTrue(hash1.startsWith("$2a$") || hash1.startsWith("$2b$") || hash1.startsWith("$2y$"));
        assertTrue(hash2.startsWith("$2a$") || hash2.startsWith("$2b$") || hash2.startsWith("$2y$"));
    }

    @Test
    void matches_retornaTrueConPasswordCorrecta() {
        String password = "password123";
        String encoded = passwordEncoder.encode(password);

        assertTrue(passwordEncoder.matches(password, encoded));
    }

    @Test
    void matches_retornaFalseConPasswordIncorrecta() {
        String encoded = passwordEncoder.encode("password123");

        assertFalse(passwordEncoder.matches("otraPassword", encoded));
    }
}