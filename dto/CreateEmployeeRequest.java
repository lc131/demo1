package com.example.springbootbackend.dto;

import java.util.List;

public class CreateEmployeeRequest {
    public String firstName;
    public String lastName;
    public String emailId;

    public String departmentName;

    public AddressDTO address;

    public List<String> projectNames;

    public static class AddressDTO {
        public String street;
        public String city;
        public String country;
    }
}
