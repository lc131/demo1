package com.example.springbootbackend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String country;

    @JsonManagedReference
    @OneToMany(
            mappedBy = "address", // auto connect to primary key address to address field in employees which is
            // address_id
            cascade = CascadeType.ALL, //Any operation you perform on the Department entity
            // will automatically be performed on its Employees too.
            orphanRemoval = true //If you remove an Employee from the Department.employees list,
            // and no one else owns that employee, it will be deleted from the database.
    )// reverse look up later
    private List<Employee> employees = new ArrayList<>();
}