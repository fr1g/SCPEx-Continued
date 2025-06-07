package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Data
@EqualsAndHashCode()
@Getter
@Setter
public class Product implements IModelClass{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    public Long id;
    public String name;

    @ManyToOne
    @JoinColumn(name = "cat_id")
    public Category category;

    @Enumerated(EnumType.ORDINAL)
    GeneralStatus status;
    // todo maybe not completely processed.

    public String barcode;
    public double singlePrice;

//
//    @Column(name = "version", insertable = false, updatable = false)
//    private Long version;

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    private String size;
    private String weight;
    private String feature;
    private int amount;
    private float discount;
    private String warehouse; // todo also warehouse

    @Column(columnDefinition = "text")
    private String note;

}
