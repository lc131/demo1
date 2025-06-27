package com.example.springbootbackend.service;

import com.example.springbootbackend.dto.CreateEmployeeRequest;
import com.example.springbootbackend.dto.EmployeeDTO;

interface EmployeeServiceInterface {
    EmployeeDTO createEmployeeWithDetails(CreateEmployeeRequest request);
}
