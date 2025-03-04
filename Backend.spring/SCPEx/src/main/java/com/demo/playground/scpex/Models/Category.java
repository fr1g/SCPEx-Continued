package com.demo.playground.scpex.Models;

import jakarta.persistence.*;

import java.util.List;

// Each product got a cat.
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false, name = "cat_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String zone;
    private String note;


    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
