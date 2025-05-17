package com.demo.playground.scpex.Models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@AllArgsConstructor
@Getter
@Setter
public class ContractNegotiation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long CNID;

    String title;
    String description;

    @ManyToOne
    @JoinColumn(name = "sender", nullable = false)
    Trader sender;

    public ContractNegotiation() { }
}
