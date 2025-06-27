package com.example.springbootbackend.dto;

import com.example.springbootbackend.model.Employee;
import com.example.springbootbackend.model.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO { // Use DTO to adjust what information will return to json format
    private Long id;
    private String firstName;
    private String lastName;
    private String emailId;
    private String departmentName;
    private String city;
    private List<String> projectName;

    public EmployeeDTO(Employee employee) {
        this.id = employee.getId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.emailId = employee.getEmailId();
        this.departmentName = employee.getDepartment() != null ? employee.getDepartment().getName() : null;
        this.city = employee.getAddress() != null ? employee.getAddress().getCity() : null;
        this.projectName = employee.getProjects() != null ? employee.getProjects().stream()
                .map(Project::getProjectName)
                .collect(Collectors.toList()) : null;
    }
}

