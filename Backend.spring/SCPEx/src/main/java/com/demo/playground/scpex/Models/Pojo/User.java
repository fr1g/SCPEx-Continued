package com.demo.playground.scpex.Models.Pojo;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@MappedSuperclass
@SuperBuilder
@Component
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String contact;

    @Enumerated(EnumType.ORDINAL)
    private Type type;

    @Enumerated(EnumType.ORDINAL)
    private GeneralStatus status;

    private Date createdDate;
    private Date birth;

    private String passwd;
    // todo got risk of double-tag of encrypt {gabxd}

    public String note;

    public User() {}

    public User secure(){
        this.passwd = "hidden";
        return this;
    }

    public User withPasswd(String passwd) {
        this.passwd = passwd;
        return this;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        switch (this.type) {
            case ADMIN:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_USERS"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_INVENTORY"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_CUSTOMERS"));
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_REGISTRAR"));
                break;

            case WAREHOUSE:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_INVENTORY"));
                break;

            case REGISTRAR:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_REGISTRAR"));
                break;

            case CUSTOMER, SELLER:
                authorities.add(new SimpleGrantedAuthority("PERMISSION_PURCHASE"));
                break;

            default: break;
        }

        return authorities;
    }

    public boolean isTrader() {
        return this.type.equals(Type.CUSTOMER) || this.type.equals(Type.SELLER);
    }

    public boolean isCustomer() { return this.type.equals(Type.CUSTOMER); }

    @Override
    public String getPassword() {
        return this.passwd;
    }

    @Override
    public String getUsername() {
        return this.contact;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !this.status.equals(GeneralStatus.REJECTED); // not rejected
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.status.equals(GeneralStatus.REJECTED); // not rejected
    }

    @Override
    public boolean isEnabled() {
        return !this.status.equals(GeneralStatus.REJECTED); // not rejected
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;//this.type.equals(Type.ADMIN);
    }
}
