package com.demo.playground.scpex.Models.Pojo;

import com.demo.playground.scpex.Models.Trade;
import com.demo.playground.scpex.Models.Transaction;

import java.util.ArrayList;
import java.util.List;

public class TradeDTO {
    public Trade trade;
    public List<Transaction> transactions;
    public TradeDTO(Trade trade, List<Transaction> transactions) {
        this.trade = trade;
        var filtered = new ArrayList<Transaction>();
        for(Transaction transaction : transactions) {
            transaction.setTrade(null);
            filtered.add(transaction);
        }
        this.transactions = filtered;
    }
}
