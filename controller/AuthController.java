package com.example.springbootbackend.controller;

import com.example.springbootbackend.model.ApplicationUser;
import com.example.springbootbackend.repository.UserRepository;
import com.example.springbootbackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            // 1. Xác thực username/password
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // 2. Lấy thông tin user từ DB
            ApplicationUser user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow();

            // 3. Tạo JWT
            String token = jwtUtil.generateToken(user);

            // 4. Trả token về client
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (AuthenticationException ex) {
            // Sai credentials
            return ResponseEntity.status(401).build();
        }
    }

    // DTO classes
    public static class AuthRequest {
        private String username;
        private String password;

        // getters & setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        public AuthResponse(String token) { this.token = token; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}

