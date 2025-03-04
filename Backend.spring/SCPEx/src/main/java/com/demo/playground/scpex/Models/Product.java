package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import jakarta.persistence.*;

@Entity
public class Product extends ProductInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cat_id")
    private Category category;


    private String size;
    private String weight;
    private String feature;
    private float discount;
    private String warehouse; // todo also warehouse
    private String note;
}
