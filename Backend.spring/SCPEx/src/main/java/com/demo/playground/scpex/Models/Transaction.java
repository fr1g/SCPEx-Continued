package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

// Each transaction have multiple trades
@Entity
@Data
public class Transaction implements IModelClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tr_id")
    private Long id;

    @OneToMany(mappedBy = "transaction")
    private List<Trade> trades;

    @ManyToOne
    @JoinColumn(name = "trader_id")
    private Trader trader;

    private GeneralStatus status = GeneralStatus.PENDING;
    private Date dateCreated;
    private Date dateUpdated;

    private double totalPrice;

}
