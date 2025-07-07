package com.example.springbootbackend.dto;

import com.example.springbootbackend.model.Employee;
import com.example.springbootbackend.model.Project;
import com.example.springbootbackend.model.Address;
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
    public AddressDTO address;  // có thể null
    private List<String> projectName;

    // Constructor mặc định (Admin dùng)
    public EmployeeDTO(Employee employee) {
        this(employee, true);
    }

    // Constructor theo flag
    public EmployeeDTO(Employee employee, boolean includeAddress) {
        this.id = employee.getId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.emailId = employee.getEmailId();
        this.departmentName = employee.getDepartment() != null ? employee.getDepartment().getName() : null;
        this.projectName = employee.getProjects() != null ? employee.getProjects().stream()
                .map(Project::getProjectName)
                .collect(Collectors.toList()) : null;
        if (includeAddress && employee.getAddress() != null) {
            Address a = employee.getAddress();
            AddressDTO dto = new AddressDTO();
            dto.street = a.getStreet();
            dto.city   = a.getCity();
            dto.country= a.getCountry();
            this.address = dto;
        } else {
            this.address = null;
        }
    }
//        this.city = employee.getAddress() != null ? employee.getAddress().getCity() : null;
//        this.street = employee.getAddress() != null ? employee.getAddress().getStreet() : null;
//        this.country = employee.getAddress() != null ? employee.getAddress().getCountry() : null;
    public static class AddressDTO {
        public String street;
        public String city;
        public String country;
    }
}

