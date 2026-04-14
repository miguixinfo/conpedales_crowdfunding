package com.conpedales.config;

import com.conpedales.model.UserEntity;
import com.conpedales.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("goncocas")) {
            UserEntity admin = new UserEntity();
            admin.setUsername("goncocas");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setEmail("admin@conpedales.com");
            admin.setRole(UserEntity.Role.ADMIN);
            admin.setEnabled(true);
            
            userRepository.save(admin);
            log.info("Usuario admin creado: goncocas");
        }
    }
}