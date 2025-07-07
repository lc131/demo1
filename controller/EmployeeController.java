package com.example.springbootbackend.controller;

import com.example.springbootbackend.dto.CreateEmployeeRequest;
import com.example.springbootbackend.dto.EmployeeDTO;
import com.example.springbootbackend.dto.UpdateEmployeeProjectsRequest;
import com.example.springbootbackend.repository.AddressRepository;
import com.example.springbootbackend.repository.DepartmentRepository;
import com.example.springbootbackend.repository.ProjectRepository;
import com.example.springbootbackend.service.EmployeeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
//    @GetMapping
//    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
//        List<EmployeeDTO> list = employeeService.getAllEmployees()
//                .stream()
//                .map(EmployeeDTO::new)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(list); //Map to DTO to get what will appear on json format
//    }
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees(Authentication auth) {
        // Kiểm tra xem user có quyền ADMIN không
        boolean isAdmin = auth.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)    // ví dụ "ROLE_ADMIN"
                .anyMatch(r -> r.equals("ROLE_ADMIN"));

        List<EmployeeDTO> list = employeeService.getAllEmployees().stream()
                .map(emp -> new EmployeeDTO(emp, isAdmin))
                .collect(Collectors.toList());

        return ResponseEntity.ok(list);
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
//    @GetMapping("/{id}")
//    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable long id) {
//        EmployeeDTO emp = employeeService.getEmployeeById(id);
//        return ResponseEntity.ok(emp);
//    }
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(
            @PathVariable long id,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_ADMIN"));

        // Dùng DTO hiện có, rồi tùy biến address:
        EmployeeDTO dto = employeeService.getEmployeeById(id);
        if (!isAdmin) {
            dto.address = null; // ẩn address với employee
        }
        return ResponseEntity.ok(dto);
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
