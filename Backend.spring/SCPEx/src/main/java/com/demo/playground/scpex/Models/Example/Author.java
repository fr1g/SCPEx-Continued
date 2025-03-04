package com.demo.playground.scpex.Models.Example;

import jakarta.persistence.*;

@Entity
public class Author{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    @OneToOne(mappedBy = "author")
    private Book book;

}