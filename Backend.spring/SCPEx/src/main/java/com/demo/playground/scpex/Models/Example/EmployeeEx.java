package com.demo.playground.scpex.Models.Example;

import jakarta.persistence.*;

@Entity
public class EmployeeEx {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "company_id")
    Company company;
}
