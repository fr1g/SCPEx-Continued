package com.demo.playground.scpex.Models;

import jakarta.persistence.*;

@Entity
public class Trader extends User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trader_id")
    private Long traderId;

    private String locations; // json array string

    @ManyToOne
    @JoinColumn(name = "emp-id")
    private Employee registrar;

    public Trader() {}
}
