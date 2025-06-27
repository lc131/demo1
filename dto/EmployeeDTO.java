package com.example.springbootbackend.dto;

import com.example.springbootbackend.model.Employee;

public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String emailId;
    private String departmentName;
    private String city;

    public EmployeeDTO(Employee employee) {
        this.id = employee.getId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.emailId = employee.getEmailId();
        this.departmentName = employee.getDepartment() != null ? employee.getDepartment().getName() : null;
        this.city = employee.getAddress() != null ? employee.getAddress().getCity() : null;
    }
}

