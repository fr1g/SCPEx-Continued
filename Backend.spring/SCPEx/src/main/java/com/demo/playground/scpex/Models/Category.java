package com.demo.playground.scpex.Models;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

// Each product got a cat.
@Entity
@Table(name = "categories")
@Data
public class Category implements IModelClass{

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
