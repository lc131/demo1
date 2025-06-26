package com.example.springbootbackend.springbootbackend.service;

import com.example.springbootbackend.springbootbackend.exception.ResourceNotFoundException;
import com.example.springbootbackend.springbootbackend.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import com.example.springbootbackend.springbootbackend.repository.EmployeeRepository;
import java.util.List;

@Service("EmployeeServiceImpl")
public class EmployeeServiceImpl {


    private EmployeeRepository employeeService;

    public EmployeeServiceImpl(EmployeeRepository employeeService) {
        this.employeeService = employeeService;
    }
    // GET API

    public List<Employee> getAllEmployees(){
        return employeeService.findAll();
    }
    // POST API
    // build create employee REST API

    public Employee createEmployee(Employee employee) {
        return employeeService.save(employee);
    }
    //GET API WITH ID
    // build get employee by id REST API

    public Employee getEmployeeById( long id){
        return employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id:" + id));
    }
    // POST API
    // build update employee REST API

    public Employee updateEmployee(long id,Employee employeeDetails) {
        Employee updateEmployee = employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));

        updateEmployee.setFirstName(employeeDetails.getFirstName());
        updateEmployee.setLastName(employeeDetails.getLastName());
        updateEmployee.setEmailId(employeeDetails.getEmailId());

        employeeService.save(updateEmployee);

        return employeeService.save(updateEmployee);
    }
    // DELETE API
    // build delete employee REST API

    public void deleteEmployee(long id){

        Employee employee = employeeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id: " + id));
        employeeService.delete(employee);

    }
}
