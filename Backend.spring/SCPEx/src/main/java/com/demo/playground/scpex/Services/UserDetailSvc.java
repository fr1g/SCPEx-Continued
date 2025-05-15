package com.demo.playground.scpex.Services;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.NullReferenceException;
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
        String[] arguments = username.split("#");
        // t#uid#12345 => trader, with ID 12345
        // e#cont#114514 => employee, with contact 114514
        var isEmployee = (!arguments[0].equals("t"));
        UserDetails userDetails = null;
        if(arguments[1].equals("cont")){
            userDetails = (isEmployee ? _e.findByContact(arguments[2]) : _t.findByContact(arguments[2]));
        }

        else userDetails = (isEmployee ?
                _e.findById(Long.parseLong(arguments[2])).orElseThrow(() ->  new NullReferenceException("No such employee"))
            :   _t.findById(Long.parseLong(arguments[2])).orElseThrow(() ->  new NullReferenceException("No such trader")));

        return userDetails;
    }
}
