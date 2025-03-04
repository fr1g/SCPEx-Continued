package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Pojo.User;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Employee extends User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empId;

    public String JobTitle;

    @OneToMany(mappedBy = "registrar")
    private List<Trader> traders;
}
