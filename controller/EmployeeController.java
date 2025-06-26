package com.example.springbootbackend.controller;

import com.example.springbootbackend.model.Employee;
import com.example.springbootbackend.service.EmployeeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {


    private final EmployeeServiceImpl employeeEmployeeServiceImpl;
    // GET API
    // Constructor-based dependency injection

    public EmployeeController(@Qualifier("EmployeeServiceImpl")EmployeeServiceImpl employeeEmployeeServiceImpl) {
        this.employeeEmployeeServiceImpl = employeeEmployeeServiceImpl;
    }

    @GetMapping
    public List<Employee> getAllEmployees(){
        return employeeEmployeeServiceImpl.getAllEmployees();
    }
    // POST API
    // build create employee REST API
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeEmployeeServiceImpl.createEmployee(employee);
    }
    //GET API WITH ID
    // build get employee by id REST API
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable long id) {
        Employee emp = employeeEmployeeServiceImpl.getEmployeeById(id);
        return ResponseEntity.ok(emp);
    }  // <-- make sure this closing brace is here
    // POST API
    // build update employee REST API
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable long id, @RequestBody Employee employeeDetails) {
        Employee updateEmployee = employeeEmployeeServiceImpl.updateEmployee(id, employeeDetails);
        return ResponseEntity.ok(updateEmployee);
    }
    // DELETE API
    // build delete employee REST API
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable long id){
        employeeEmployeeServiceImpl.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
