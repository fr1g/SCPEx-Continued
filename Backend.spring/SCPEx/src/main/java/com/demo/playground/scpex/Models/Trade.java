package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

// Each transaction have multiple transactions
@Entity
@Data
public class Trade implements IModelClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trade_id")
    private Long id;

    @OneToMany(mappedBy = "transaction")
    @Nullable
    transient private List<Transaction> transactions;

    @ManyToOne
    @JoinColumn(name = "trader_id")
    private Trader trader;

    private GeneralStatus status = GeneralStatus.PENDING;
    private Date dateCreated;
    private Date dateUpdated;

    private double totalPrice;

}
