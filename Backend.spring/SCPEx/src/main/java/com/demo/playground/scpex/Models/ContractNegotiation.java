package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@Getter
@Setter
public class ContractNegotiation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    String title;
    String description;

    Date dateCreated = new Date();

    @Enumerated(EnumType.ORDINAL)
    private GeneralStatus status = GeneralStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "contract_sender", nullable = false)
    Trader sender;

    public ContractNegotiation() { }
}
