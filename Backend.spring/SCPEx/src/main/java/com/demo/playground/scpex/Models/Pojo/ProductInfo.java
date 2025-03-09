package com.demo.playground.scpex.Models.Pojo;

import com.demo.playground.scpex.Models.Category;
import jakarta.persistence.*;
import lombok.Data;

@Data
@MappedSuperclass
public class ProductInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String name;

    @ManyToOne
    @JoinColumn(name = "cat_id")
    public Category category;

    public String barcode;
    public double singlePrice;

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

}
