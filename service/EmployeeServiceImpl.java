package com.example.springbootbackend.service;

import com.example.springbootbackend.dto.CreateEmployeeRequest;
import com.example.springbootbackend.dto.EmployeeDTO;
import com.example.springbootbackend.dto.UpdateEmployeeProjectsRequest;
import com.example.springbootbackend.exception.ResourceNotFoundException;
import com.example.springbootbackend.model.*;
import com.example.springbootbackend.repository.AddressRepository;
import com.example.springbootbackend.repository.DepartmentRepository;
import com.example.springbootbackend.repository.EmployeeRepository;
import com.example.springbootbackend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service("EmployeeServiceImpl")
public class EmployeeServiceImpl implements EmployeeServiceInterface{

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProjectRepository projectRepository;


    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // GET all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

//    // CREATE new employee
//    public Employee createEmployee(Employee employee) {
//        // Đảm bảo quan hệ được thiết lập đúng
////        if (employee.getAddress() != null) {
////            employee.getAddress().setEmployee(employee); //  OneToOne
////        }
//        return employeeRepository.save(employee);
//    }
    @Override
    public EmployeeDTO createEmployeeWithDetails(CreateEmployeeRequest request) {
        // Create Employee
        Employee employee = new Employee();
        employee.setFirstName(request.firstName);
        employee.setLastName(request.lastName);
        employee.setEmailId(request.emailId);

        // Department (find or create)
        Department dept = departmentRepository.findByName(request.departmentName)
                .orElseGet(() -> departmentRepository.save(new Department(null, request.departmentName, new ArrayList<>())));
        employee.setDepartment(dept);

        // Address (find or create)
        Address address = addressRepository.findByStreetAndCityAndCountry(
                request.address.street,
                request.address.city,
                request.address.country
        ).orElseGet(() -> {
            Address newAddr = new Address();
            newAddr.setStreet(request.address.street);
            newAddr.setCity(request.address.city);
            newAddr.setCountry(request.address.country);
            return addressRepository.save(newAddr);
        });
        employee.setAddress(address);

        // Projects (find or create)
        Set<Project> projects = request.projectNames.stream()
                .map(name -> projectRepository.findByProjectName(name)
                        .orElseGet(() -> projectRepository.save(new Project(null, name, new HashSet<>())))
                ).collect(Collectors.toSet());
        employee.setProjects(projects);

        // Save and return
        Employee saved = employeeRepository.save(employee);
        return new EmployeeDTO(saved);
    }

    // GET employee by ID
    public EmployeeDTO getEmployeeById(long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));
        return new EmployeeDTO(employee);
    }

    // UPDATE employee ( IF PROJECTS THEN ADD )
    public EmployeeDTO updateEmployee(long id, CreateEmployeeRequest request) {
        Employee updateEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));

        //Basic fields
        if (request.firstName != null) updateEmployee.setFirstName(request.firstName);
        if (request.lastName != null) updateEmployee.setLastName(request.lastName);
        if (request.emailId != null) updateEmployee.setEmailId(request.emailId);

        // Department (find or replace)
        if (request.departmentName != null) {
            Department dept = departmentRepository.findByName(request.departmentName)
                    .orElseGet(() -> departmentRepository.save(new Department(null, request.departmentName, new ArrayList<>())));
            updateEmployee.setDepartment(dept);
        }

        // Address (find or replace)
        if (request.address != null &&
                request.address.street != null &&
                request.address.city != null &&
                request.address.country != null) {
            Address address = addressRepository.findByStreetAndCityAndCountry(
                    request.address.street,
                    request.address.city,
                    request.address.country
            ).orElseGet(() -> {
                Address newAddr = new Address();
                newAddr.setStreet(request.address.street);
                newAddr.setCity(request.address.city);
                newAddr.setCountry(request.address.country);
                return addressRepository.save(newAddr);
            });

            updateEmployee.setAddress(address);
        }

        // Project (find or replace)
        if (request.projectNames != null) {
            Set<Project> projects = request.projectNames.stream()
                    .map(projectName -> projectRepository.findByProjectName(projectName)
                            .orElseGet(() -> projectRepository.save(new Project(null, projectName, new HashSet<>()))))
                    .collect(Collectors.toSet());
            updateEmployee.setProjects(projects);
        }
        Employee saved = employeeRepository.save(updateEmployee);
        return new EmployeeDTO(saved);

    }

    // Update project
    public void updateEmployeeProjects(UpdateEmployeeProjectsRequest request) {
        for (UpdateEmployeeProjectsRequest.EmployeeProjectUpdate update : request.updates) {
            Employee emp = employeeRepository.findById(update.employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + update.employeeId));

            // Add projects
            if (update.addProjects != null) {
                for (String name : update.addProjects) {
                    Project proj = projectRepository.findByProjectName(name)
                            .orElseGet(() -> projectRepository.save(new Project(null, name, new HashSet<>())));
                    emp.addProject(proj);
                }
            }

            // Remove projects
            if (update.removeProjects != null) {
                for (String name : update.removeProjects) {
                    projectRepository.findByProjectName(name).ifPresent(emp::removeProject);
                }
            }

            employeeRepository.save(emp);
        }
    }



    // DELETE employee
    public void deleteEmployee(long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));
        employeeRepository.delete(employee);
    }
}
