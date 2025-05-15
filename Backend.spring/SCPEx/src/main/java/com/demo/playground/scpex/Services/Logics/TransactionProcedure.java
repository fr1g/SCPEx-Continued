package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Models.Trade;
import com.demo.playground.scpex.Models.Transaction;
import com.demo.playground.scpex.Repositories.RepoTrade;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Repositories.RepoTransaction;
import com.demo.playground.scpex.Services.TransactionSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionProcedure {
    /* todo
        - create transaction ()
        - create transactions (by list)
        -

     */
    @Autowired
    RepoTransaction _trans;

    @Autowired
    RepoTrade _trade;

    @Autowired
    RepoTrader _t;

    @Autowired
    TransactionSvc transactionSvc;

    public void createTransaction(Long tradeId, Trade transObject) {
        if(!transactionSvc.isThisExist(tradeId)) throw new NullReferenceException("No such transaction list");

    }

    public void createTrade(Long traderId, List<Trade> tradeList) {
        var trade = new Transaction();
//        trade.set
    }
}
