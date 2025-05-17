package com.demo.playground.scpex.Models.Pojo;

import com.demo.playground.scpex.Models.Category;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.persistence.*;
import lombok.Data;

@Data
@MappedSuperclass
public class ProductInfo {
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

}
