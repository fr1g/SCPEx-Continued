package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailSvc implements UserDetailsService {
    @Autowired
    RepoEmployee _e;

    @Autowired
    RepoTrader _t;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
