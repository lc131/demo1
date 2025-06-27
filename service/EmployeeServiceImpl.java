package com.example.springbootbackend.service;

import com.example.springbootbackend.dto.CreateEmployeeRequest;
import com.example.springbootbackend.dto.EmployeeDTO;
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
        Employee emp = new Employee();
        emp.setFirstName(request.firstName);
        emp.setLastName(request.lastName);
        emp.setEmailId(request.emailId);

        // Department (find or create)
        Department dept = departmentRepository.findByName(request.departmentName)
                .orElseGet(() -> departmentRepository.save(new Department(null, request.departmentName, new ArrayList<>())));
        emp.setDepartment(dept);

        // Address (find or create)
        Address addr = addressRepository.findByStreetAndCityAndCountry(
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
        emp.setAddress(addr);

        // Projects (find or create)
        Set<Project> projects = request.projectNames.stream()
                .map(name -> projectRepository.findByProjectName(name)
                        .orElseGet(() -> projectRepository.save(new Project(null, name, new HashSet<>())))
                ).collect(Collectors.toSet());
        emp.setProjects(projects);

        // Save and return
        Employee saved = employeeRepository.save(emp);
        return new EmployeeDTO(saved);
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
