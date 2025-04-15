package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Pojo.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper=true)
public class Trader extends User implements IModelClass{

    @Column(columnDefinition = "text")
    private String locationJson = "{\"prefers\":  []}"; // json array string

    @ManyToOne
    @JoinColumn(name = "registrar", nullable = false)
    private Employee registrar;

    @Column(columnDefinition = "text")
    private String preferJson = "{\"prefers\":  []}";

    public Trader() {}
}
