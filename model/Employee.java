package com.example.springbootbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {

    @Id //marks the field as the primary key of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Automatically generate a value for this @Id when inserting a new row
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email_id")
    private String emailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id") // foreign key column in employees table
    @JsonBackReference // prevents circular JSON serialization //Child / Inverse side
    private Department department;

    @ManyToOne
    @JoinColumn(name = "address_id") // foreign key column in employees table
    @JsonBackReference
    private Address address;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "employee_project",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    @JsonBackReference
    private Set<Project> projects = new HashSet<>();

    /**
     * Convenience method to add a project and maintain bidirectional relationship
     */
    public void addProject(Project project) {
        this.projects.add(project);
        project.getEmployees().add(this);
    }

    /**
     * Convenience method to remove a project
     */
    public void removeProject(Project project) {
        this.projects.remove(project);
        project.getEmployees().remove(this);
    }
}