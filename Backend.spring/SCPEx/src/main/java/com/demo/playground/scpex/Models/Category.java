package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

// Each product got a cat.
@Entity
@Table(name = "categories")
@AllArgsConstructor
@Data
public class Category implements IModelClass{

//    public Category(@Nullable List<Product> products, String note, String zone, String name, Long id) {
//        this.products = products;
//        this.note = note;
//        this.zone = zone;
//        this.name = name;
//        this.id = id;
//    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false, name = "cat_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String zone;
    private String note;

    @Enumerated(EnumType.ORDINAL)
    private GeneralStatus status;

    @OneToMany(mappedBy = "category")
    @Nullable
    transient private List<Product> products;

    public Category(String name, String note){
        this.name = name;
        this.note = note;
    }

    public Category() {

    }
}
