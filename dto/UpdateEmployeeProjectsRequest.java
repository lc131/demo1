package com.example.springbootbackend.dto;

import java.util.List;

public class UpdateEmployeeProjectsRequest {
    public List<EmployeeProjectUpdate> updates;
    public static class EmployeeProjectUpdate {
        public Long id;
        public List<String> addProjects;
        public List<String> removeProjects;
    }
}
