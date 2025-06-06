package com.demo.playground.scpex.Models;

import com.demo.playground.scpex.Models.Pojo.User;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper=true)
@AllArgsConstructor
@Entity
@SuperBuilder
public class Employee extends User implements IModelClass{

    public String jobTitle;

    @OneToMany(mappedBy = "registrar")
    @jakarta.annotation.Nullable
    transient private List<Trader> traders;

    public Employee() { }

    public Employee(Long temporaryId) {
        super.setId(temporaryId);
    }
}
