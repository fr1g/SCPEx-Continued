package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Repositories.RepoProduct;
import com.demo.playground.scpex.Repositories.RepoTrader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TraderUsage {
    // the customer-logics for traders.
    /* todo
    - edit address-book (json)
    - edit cart (json)
    - seller: open contract-negotiation :: Complete: We received your request. If we're interested to it, we will get in touch with you.
    - customer: purchase and manage trades (trade is a list of transactions.)

     */

    @Autowired
    RepoTrader _t;

    @Autowired
    RepoProduct _p;



}

