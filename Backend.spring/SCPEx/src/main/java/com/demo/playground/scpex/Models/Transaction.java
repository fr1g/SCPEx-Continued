package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.Date;

// as a part of trade, recording the exact product, price, amount and total price, discount and so on
@Entity
@Data
@AllArgsConstructor
@Getter
public class Transaction implements IModelClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private long Id;

    @ManyToOne
    @JoinColumn(name = "record_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "trade_id")
    private Trade trade;

    private int amount;
    private double price;
    private float discount = 1f;
    private String warehouse = "#main"; // todo: can be a warehouse's unique name, or just refer onto the usertype@warehouse
    private String logisticLink;
    private GeneralStatus status = GeneralStatus.PENDING;
    private Date dateCreated;
    private Date dateUpdated;
    private String note;

    public Long getId(){
        return this.Id;
    }


    public Transaction() {

    }
}
