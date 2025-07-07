package com.example.springbootbackend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

// Use DTO to adjust what information will need for input
public class CreateEmployeeRequest {
    public String firstName;
    public String lastName;
    public String emailId;

    public String departmentName;

    public AddressDTO address;

    public List<String> projectNames;

    @NotNull
    public static class AddressDTO {
        public String street;
        public String city;
        public String country;
    }
}
