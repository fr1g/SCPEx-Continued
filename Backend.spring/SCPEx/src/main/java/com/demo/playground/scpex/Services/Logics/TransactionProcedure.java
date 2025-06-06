package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Product;
import com.demo.playground.scpex.Models.Trade;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Models.Transaction;
import com.demo.playground.scpex.Repositories.RepoProduct;
import com.demo.playground.scpex.Repositories.RepoTrade;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Repositories.RepoTransaction;
import com.demo.playground.scpex.Services.TransactionSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionProcedure {
    /* todo
        - create transaction ()
        - update transaction (update the status, update trade status)
     */
    @Autowired
    RepoTransaction _trans;

    @Autowired
    RepoTrade _trade;

    @Autowired
    RepoTrader _t;

    @Autowired
    RepoProduct _p;

    /*
          get paged of transactions under the trade
          related todo: GETTING ONE'S TRADES(BASIC INFO) AND PAGED RELATED TRANSACTIONS(MAIN)
     */
    public Page<Trade>getPagedTrades(Pageable pageable, Trader acquirer) {
        var result = _trade.findAllOfTrader(pageable, acquirer.secure().getId());
        return result.map(x -> {
            x.setTrader((Trader)x.getTrader().secure());
            return x;
        });
    }

    public Page<Trade>getPagedTrades(Pageable pageable) {
        var result = _trade.findAll(pageable);
        return result.map(x -> {
            x.setTrader((Trader)x.getTrader().secure());
            return x;
        });
    }

    // okay why not use trader typed acquirer? what was i thought bout'?
    public Page<Transaction> getPagedTransactions(Pageable pageable, Long requiringTradeId, Long acquirer) {
        var target = _trade.findById(requiringTradeId).orElseThrow(() -> new NullReferenceException("No trade found with id " + requiringTradeId));
        if(!target.getTrader().getId().equals(acquirer)) throw new NullReferenceException("Trader acquired but not acquirer");
        return _trans.findAllOfGivenTrade(pageable, requiringTradeId);
    }

    /*
          update transaction: for updating status
          related todo: UPDATE STATUS OF TRADE/TRANSACTION
     */

    public Trade updateTransaction(Long tid, int statusEnumIndex) {
        var newStatus = (GeneralStatus.values()[statusEnumIndex]);
        var targetTransaction = _trans.findById(tid).orElseThrow(() -> new NullReferenceException("Transaction not found"));
        targetTransaction.setStatus(newStatus);
        _trans.saveAndFlush(targetTransaction);
        if(targetTransaction.getTrade().isAllStatusSame(newStatus)) { // ?
            targetTransaction.getTrade().setStatus(newStatus);
            _trade.saveAndFlush(targetTransaction.getTrade());
        }
        return targetTransaction.getTrade();
    }

    /*
          transition: creation of order
          user adds stuff into the cart
          backend update each times during cart creation and edit

          onUserSubmitPayment:
            backend get the user's newest cartJson;
            use contents inside cartJson to create ArrayList to reveal real purchase list
            each product will create 1:1 transaction and save
            transactions will be combined as Trade
            Trade calculates the total price and save to DB

     */

    public Trade paymentProcedure(Long purchasingUserId, String logisticInfo){
        var trader = _t.findById(purchasingUserId).orElseThrow(() -> new NullReferenceException("[TrCE] Purchasing cart (Trader) not found"));
        var purchasingCart = ((new Gson()).fromJson(trader.getPreferJson(), JsonObject.class)).getAsJsonArray("prefers");
        Trade trade = new Trade();
        trade.setTrader(trader);
        var convertedCart = new ArrayList<Transaction>();
        var finalPrice = 0d;
        for(var item : purchasingCart){
            var mirroredProduct = (new Gson()).fromJson(item, Product.class);
            var revealedProduct = _p.findById(mirroredProduct.getId()).orElseThrow(() -> new NullReferenceException("[PrNF] Product not found")); // if the product sent is invalid, refuse it.
            var transactionPrice =
                    revealedProduct.getSinglePrice() *
                    mirroredProduct.getAmount() *
                    revealedProduct.getDiscount();

            // creating transaction, give revealed discount, price; give mirrored amount

            Transaction transaction = new Transaction();
            transaction.setProduct(revealedProduct); // raw record of product
            transaction.setPrice(transactionPrice);
            transaction.setAmount(mirroredProduct.getAmount());
            transaction.setDiscount(revealedProduct.getDiscount()); //  mirroring revealed discount

            transaction.setStatus(GeneralStatus.PENDING);

            // the logic of logistic info, scalable with json (?)
            transaction.setLogisticLink(logisticInfo);

            var saved = _trans.save(transaction);

            convertedCart.add(saved);

            finalPrice += transactionPrice;

        }

        trade.setTransactions(convertedCart);
        trade.setTotalPrice(finalPrice);
        trade.setStatus(GeneralStatus.PENDING);

        return _trade.save(trade);

    }

}
