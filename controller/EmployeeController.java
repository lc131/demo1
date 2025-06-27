package com.example.springbootbackend.controller;

import com.example.springbootbackend.dto.CreateEmployeeRequest;
import com.example.springbootbackend.dto.EmployeeDTO;
import com.example.springbootbackend.dto.UpdateEmployeeProjectsRequest;
import com.example.springbootbackend.exception.ResourceNotFoundException;
import com.example.springbootbackend.model.Address;
import com.example.springbootbackend.model.Department;
import com.example.springbootbackend.model.Employee;
import com.example.springbootbackend.model.Project;
import com.example.springbootbackend.repository.AddressRepository;
import com.example.springbootbackend.repository.DepartmentRepository;
import com.example.springbootbackend.repository.ProjectRepository;
import com.example.springbootbackend.service.EmployeeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AddressRepository addressRepository;

    private final EmployeeServiceImpl employeeService;

    public EmployeeController(@Qualifier("EmployeeServiceImpl") EmployeeServiceImpl employeeService) {
        this.employeeService = employeeService;
    }

    // GET all employees
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        List<EmployeeDTO> list = employeeService.getAllEmployees()
                .stream()
                .map(EmployeeDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list); //Map to DTO to get what will appear on json format
    }

    // CREATE new employee (with Department, Address, Projects)
//    @PostMapping
//    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
//        Employee saved = employeeService.createEmployee(employee);
//        return ResponseEntity.ok(saved);
//    }
    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody CreateEmployeeRequest request) {
        EmployeeDTO saved = employeeService.createEmployeeWithDetails(request);
        return ResponseEntity.ok(saved);
    }

    // GET employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable long id) {
        EmployeeDTO emp = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(emp);
    }

    // UPDATE projects
    @PutMapping("/projects")
    public ResponseEntity<Void> updateEmployeeProjects(
            @RequestBody UpdateEmployeeProjectsRequest request) {

        employeeService.updateEmployeeProjects(request);
        return ResponseEntity.ok().build();
    }

    // UPDATE employee
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable long id,
                                                   @RequestBody CreateEmployeeRequest request) {
        EmployeeDTO updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(updated);
    }

    // DELETE employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
