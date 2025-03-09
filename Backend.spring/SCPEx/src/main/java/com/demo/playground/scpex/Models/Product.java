package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Pojo.ProductInfo;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper=true)
public class Product extends ProductInfo implements IModelClass{

    private String size;
    private String weight;
    private String feature;
    private float discount;
    private String warehouse; // todo also warehouse
    private String note;
}
