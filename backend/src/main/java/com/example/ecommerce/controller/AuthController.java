package com.example.ecommerce.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email et mot de passe sont requis");
        }

        return ResponseEntity.ok().body(new AuthResponse(
            "Utilisateur créé avec succès",
            "jwt-token-here",
            request.getEmail()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email et mot de passe sont requis");
        }

        return ResponseEntity.ok().body(new AuthResponse(
            "Connexion réussie",
            "jwt-token-here",
            request.getEmail()
        ));
    }

    public static class SignupRequest {
        private String email;
        private String password;

        public SignupRequest() {}
        public SignupRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String message;
        private String token;
        private String email;

        public AuthResponse() {}
        public AuthResponse(String message, String token, String email) {
            this.message = message;
            this.token = token;
            this.email = email;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
