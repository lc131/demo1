package com.example.springbootbackend.service;

import com.example.springbootbackend.exception.ResourceNotFoundException;
import com.example.springbootbackend.model.*;
import com.example.springbootbackend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service("EmployeeServiceImpl")
public class EmployeeServiceImpl {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // GET all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // CREATE new employee
    public Employee createEmployee(Employee employee) {
        // Đảm bảo quan hệ được thiết lập đúng
//        if (employee.getAddress() != null) {
//            employee.getAddress().setEmployee(employee); //  OneToOne
//        }
        return employeeRepository.save(employee);
    }

    // GET employee by ID
    public Employee getEmployeeById(long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));
    }

    // UPDATE employee
    public Employee updateEmployee(long id, Employee employeeDetails) {
        Employee updateEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));

        updateEmployee.setFirstName(employeeDetails.getFirstName());
        updateEmployee.setLastName(employeeDetails.getLastName());
        updateEmployee.setEmailId(employeeDetails.getEmailId());

        // Cập nhật Department nếu có
        if (employeeDetails.getDepartment() != null) {
            updateEmployee.setDepartment(employeeDetails.getDepartment());
        }

        // Cập nhật Address
        updateEmployee.setAddress(employeeDetails.getAddress());

        // Cập nhật Project nếu có
        Set<Project> updatedProjects = employeeDetails.getProjects();
        if (updatedProjects != null) {
            updateEmployee.setProjects(updatedProjects);
        }

        return employeeRepository.save(updateEmployee);
    }

    // DELETE employee
    public void deleteEmployee(long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));
        employeeRepository.delete(employee);
    }
}
