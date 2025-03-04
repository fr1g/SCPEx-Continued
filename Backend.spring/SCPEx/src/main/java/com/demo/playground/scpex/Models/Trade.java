package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.persistence.*;

import java.util.Date;

// as a part of transaction, recording the exact product, price, amount and total price, discount and so on
@Entity
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private long id;

    @ManyToOne
    @JoinColumn(name = "record_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "tr_id")
    private Transaction transaction;

    private int amount;
    private double price;
    private float discount = 1f;
    private String warehouse = "#main"; // todo: can be a warehouse's unique name, or just refer onto the usertype@warehouse
    private String logisticLink;
    private GeneralStatus status = GeneralStatus.PENDING;
    private Date dateCreated;
    private Date dateUpdated;
    private String note;


}
