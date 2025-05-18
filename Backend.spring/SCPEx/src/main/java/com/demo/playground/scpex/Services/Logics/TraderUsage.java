package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoProduct;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Services.TraderSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.utils.JsonManualArrayPushHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TraderUsage {
    // the customer-logics for traders.
    /* todo
    - seller: open contract-negotiation :: Complete: We received your request. If we're interested to it, we will get in touch with you.
    - customer: purchase and manage trades (trade is a list of transactions.)

     */

    @Autowired
    RepoTrader _t;

    @Autowired
    TraderSvc _ts;

    @Autowired
    RepoProduct _p;

    public void addToCart(Long traderId, Long productId, int quantity) {
        try {
            var product = _p.findById(productId).orElseThrow(() -> new NullReferenceException("Product not found"));
            product.setAmount(quantity);

            // whatever.
            var trader = _t.findById(traderId).orElseThrow(() -> new NullReferenceException("Trader not found"));

            var newJsonString = JsonManualArrayPushHelper.push(trader.getPreferJson(), (new Gson()).toJson(product), "prefers");

            updateCart(traderId, newJsonString);
            /* format:
                {
                    "prefers": [..., + ]
                }
             */
        }catch (Exception ex){
            ex.printStackTrace();
        }

    }

    public void updateCart(Long traderId, String newStateCartJson) { // directly
        try {
            var proccTarget = _t.findById(traderId).orElseThrow(() -> new NullReferenceException("Trader not found"));
            proccTarget.setPreferJson(newStateCartJson);
            _ts.update(proccTarget);
        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    public void updateLocation(Long traderId, String newStateJson) { // directly pass the new address book.
        try {
            var trader = _t.findById(traderId).orElseThrow(() -> new NullReferenceException("Trader not found"));

            trader.setLocationJson(newStateJson);
            _ts.update(trader);

        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

}

