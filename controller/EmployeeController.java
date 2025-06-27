package com.example.springbootbackend.controller;

import com.example.springbootbackend.exception.ResourceNotFoundException;
import com.example.springbootbackend.model.Employee;
import com.example.springbootbackend.service.EmployeeServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeServiceImpl employeeService;

    public EmployeeController(@Qualifier("EmployeeServiceImpl") EmployeeServiceImpl employeeService) {
        this.employeeService = employeeService;
    }

    // GET all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> list = employeeService.getAllEmployees();
        return ResponseEntity.ok(list);
    }

    // CREATE new employee (with Department, Address, Projects)
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee saved = employeeService.createEmployee(employee);
        return ResponseEntity.ok(saved);
    }

    // GET employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable long id) {
        Employee emp = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(emp);
    }

    // UPDATE employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable long id,
                                                   @RequestBody Employee employeeDetails) {
        Employee updated = employeeService.updateEmployee(id, employeeDetails);
        return ResponseEntity.ok(updated);
    }

    // DELETE employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
