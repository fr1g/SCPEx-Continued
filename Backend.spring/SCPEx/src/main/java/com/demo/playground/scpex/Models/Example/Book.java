package com.demo.playground.scpex.Models.Example;

import jakarta.persistence.*;

@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String title;

    @OneToOne
    @JoinColumn(name = "author_id")
    private Author author;


}
