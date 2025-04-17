package com.demo.playground.scpex.Models.Pojo;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@AllArgsConstructor
@MappedSuperclass
@SuperBuilder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contact;

    @Enumerated(EnumType.ORDINAL)
    private Type type;

    @Enumerated(EnumType.ORDINAL)
    private GeneralStatus status;

    private Date createdDate;
    private Date birth;

    private String passwd;

    public String note;

    public void Ban(){

    }
    public void Unban(){

    }

    public void UpdateInfo(){

    }
    public User() {}

    public User secure(){
        this.passwd = "hidden";
        return this;
    }

    public User withPasswd(String passwd) {
        this.passwd = passwd;
        return this;
    }
}
