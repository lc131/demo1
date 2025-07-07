package com.example.springbootbackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "application_user")
@Data
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Getters and setters
}

