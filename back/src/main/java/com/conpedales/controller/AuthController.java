package com.conpedales.controller;

import com.conpedales.dto.AuthResponse;
import com.conpedales.dto.LoginRequest;
import com.conpedales.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("[AUTH] === PETICION DE LOGIN RECIBIDA ===");
        log.info("[AUTH] Username: {}", request.username());
        
        try {
            log.info("[AUTH] Autenticando usuario...");
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.username(),
                            request.password()
                    )
            );
            log.info("[AUTH] Autenticación exitosa");

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
            log.info("[AUTH] Usuario cargado: {}", userDetails.getUsername());
            
            String token = jwtService.generateToken(userDetails);
            log.info("[AUTH] Token generado exitosamente");

            log.info("[AUTH] === LOGIN EXITOSO ===");
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            log.error("[AUTH] === ERROR EN LOGIN ===");
            log.error("[AUTH] Error type: {}", e.getClass().getSimpleName());
            log.error("[AUTH] Error message: {}", e.getMessage());
            throw e;
        }
    }
}