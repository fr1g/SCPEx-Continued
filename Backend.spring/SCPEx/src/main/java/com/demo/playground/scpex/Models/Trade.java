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

    @OneToMany(mappedBy = "trade")
    @Nullable
    private List<Transaction> transactions;

    @ManyToOne
    @JoinColumn(name = "trader_id")
    private Trader trader;

    @Enumerated(EnumType.ORDINAL)
    private GeneralStatus status = GeneralStatus.PENDING;

    private Date dateCreated;
    private Date dateUpdated;

    private double totalPrice;

    public boolean isAllStatusSame(GeneralStatus status) {
        for(var sub : this.transactions) {
            if(!sub.getStatus().equals(status)) return false;
        }
        return true;
    }
}
