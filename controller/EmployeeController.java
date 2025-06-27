package com.example.springbootbackend.controller;

import com.example.springbootbackend.dto.CreateEmployeeRequest;
import com.example.springbootbackend.dto.EmployeeDTO;
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

        // Create Employee
        Employee emp = new Employee();
        emp.setFirstName(request.firstName);
        emp.setLastName(request.lastName);
        emp.setEmailId(request.emailId);

        // Department (find or create)
        Department dept = departmentRepository.findByName(request.departmentName)
                .orElseGet(() -> departmentRepository.save(new Department(null, request.departmentName, new ArrayList<>())));
        emp.setDepartment(dept);

        // Address (always create new)
        Address addr = new Address();
        addr.setStreet(request.address.street);
        addr.setCity(request.address.city);
        addr.setCountry(request.address.country);
        addressRepository.save(addr);
        emp.setAddress(addr);

        // Projects (find or create)
        Set<Project> projects = request.projectNames.stream()
                .map(name -> projectRepository.findByProjectName(name)
                        .orElseGet(() -> projectRepository.save(new Project(null, name, new HashSet<>())))
                ).collect(Collectors.toSet());
        emp.setProjects(projects);

        Employee saved = employeeService.createEmployee(emp);
        return ResponseEntity.ok(new EmployeeDTO(saved));
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
