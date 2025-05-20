package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.ContractNegotiation;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Pojo.User;
import com.demo.playground.scpex.Models.Trade;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Models.Transaction;
import com.demo.playground.scpex.Repositories.RepoCN;
import com.demo.playground.scpex.Services.Logics.TraderUsage;
import com.demo.playground.scpex.Services.Logics.TransactionProcedure;
import com.demo.playground.scpex.Services.TraderSvc;
import com.demo.playground.scpex.Services.TransactionSvc;
import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.utils.JwtHelper;
import com.demo.playground.scpex.utils.ResponseHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/trade")
public class TradeController {

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    UserDetailSvc _us;

    @Autowired
    TraderSvc _t;

    @Autowired
    TransactionProcedure _logic;

    @Autowired
    TraderUsage _t_u;

    @Autowired
    RepoCN _cn;

    @Autowired
    TransactionSvc _trans;

    @PostMapping("/trades/query/{page}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> queryTrades(@RequestHeader(name = "Authorization") String token, @RequestBody String pageReq, @PathVariable("page") int pageNum){
        try {
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));

            var page = (new Gson()).fromJson(pageReq, PageRequest.class);
            var res = (new Gson()).toJson(_logic.getPagedTrades(page.toPageable(pageNum), (Trader)revealedUser));

            return ResponseHelper.Return(new Response(200, "done", res));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User Cart not found, or other exception.", ex.getMessage()));
        }
    }
    // todo: update transaction by id; else.
    @PostMapping("/trades/update/{transactionId}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')") // only warehouse and admin.
    public ResponseEntity<String> updateTransaction(@RequestBody String newTransactionStateJson, @PathVariable("transactionId") long targetId) {
        try {
            var newState = (new Gson()).fromJson(newTransactionStateJson, Transaction.class);
            if(!_trans.isThisExist(targetId)) throw new NullReferenceException("No such transaction");
            _trans.update(newState);
            return ResponseHelper.Return(new Response(200, "done"));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(404, "Failed to update.", ex.getMessage()));
        }
    }

    @PostMapping("/cn/create")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> createContractNegotiation(@RequestHeader(name = "Authorization") String token, @RequestBody String cnJson) {
        try {
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(revealedUser.isCustomer())
                throw new PermissionDeniedDataAccessException("This is not for normal customer. ", new Exception("[NSP] No sufficient permission "));

            var cn = new Gson().fromJson(cnJson, ContractNegotiation.class);
            cn.setSender((Trader)revealedUser);
            var submittedId = _cn.saveAndFlush(cn);
            return ResponseHelper.Return(new Response(200, "We got you", "" + submittedId));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "Not allowed. ", ex.getMessage()));
        }
    }

    @PostMapping("/cn/list/{pageNum}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY', 'PERMISSION_PURCHASE')") // maybe the creator also?
    public ResponseEntity<String> getPagedCNs(@RequestHeader(name = "Authorization") String token, @RequestBody String pageReqJson, @PathVariable("pageNum") int pageNum) {
        try {
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if((revealedUser.isCustomer() || !revealedUser.isTrader() && !(revealedUser.getType().equals(Type.WAREHOUSE) || revealedUser.getType().equals(Type.ADMIN))))
                // is !(warehouse, seller, admin) // if something bad happened, try to replace with it.
                return ResponseHelper.Return(new Response(403, "Insufficient permission."));

            var pageable = (new Gson()).fromJson(pageReqJson, PageRequest.class).toPageable(pageNum);
            var result = ((revealedUser.isTrader()) ? _cn.findAllOfSeller(revealedUser.getId(), pageable) : _cn.findAll(pageable)).map(x -> {
                // todo maybe cause error: else not need to secure, maybe the returned data never contains any need-to-secure stuff?
                ((ContractNegotiation)x).setSender((Trader) ((ContractNegotiation)x).getSender().secure());
                return x;
            });
            return ResponseHelper.Return(new Response(200, "Result Presented", (new Gson()).toJson(result)));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "Not allowed. ", ex.getMessage()));
        }
    }

    @PostMapping("/cn/update")
    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    public ResponseEntity<String> updateCN(@RequestBody String cnJson) {
        try{
            _cn.saveAndFlush(new Gson().fromJson(cnJson, ContractNegotiation.class));
            return ResponseHelper.Return(new Response(200, "done"));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "Sth wrong happened. ", ex.getMessage()));
        }
    }



    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> createTrade(@RequestHeader(name = "Authorization") String token, @RequestBody String chosenAddressJson){
        //  using current cart to create trade
        try{
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));

            if(((Trader)revealedUser).getPreferJson().equals((new Trader()).getPreferJson()))
                throw new NullReferenceException("This trader has nothing inside cart. ");

//            if(revealedUser.getLocationJson().con) check if location valid. i'm not going to care about it anymore.
            var createdTrade = _logic.paymentProcedure(revealedUser.getId(), chosenAddressJson);
            ((Trader) revealedUser).setPreferJson((new Trader()).getPreferJson()); // getting default value
            _t.update((Trader) revealedUser);
            return ResponseHelper.Return(new Response(200, "created. ID: " + createdTrade.getId(), (new Gson()).toJson(createdTrade)));
        }
        catch(Exception e){
            return ResponseHelper.Return(new Response(403, "User Cart not found, or other exception.", e.getMessage()));
        }
    }


    @PostMapping("/addr")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')") // maybe, not allowing admins to reveal customers' location is the best
    public ResponseEntity<String> updateAddress(@RequestHeader(name = "Authorization") String token, @RequestBody String addressJson){
        try{
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));

            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(_t_u.updateLocation(revealedUser.getId(), addressJson))));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User addr-book not found, or other exception.", ex.getMessage()));
        }
    }

    @PostMapping("/cart/add")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> addToCart(@RequestHeader(name = "Authorization") String token,
                                            @RequestBody String tuple){
        // the operation inside the product info page, add in touch.
        try{
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));

            long[] parsedTuple = new long[2]; // [productId, quantity]
            int index = 0;
            for(var x : tuple.split(",")){
                parsedTuple[index] = Long.parseLong(x.trim());
                index++;
            }

            var result = _t_u.addToCart(((Trader) revealedUser).getId(), parsedTuple[0], (int)parsedTuple[1]); // not that good...
            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(result)));


        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User cart not found, or other exception.", ex.getMessage()));

        }
    }

    @PostMapping("/cart/update")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> updateCart(@RequestHeader(name = "Authorization") String token,
                                             @RequestBody String newPrefersJson){
        try {
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            // well, actually, this MUST BE a user type of trader...
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));
            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(_t_u.updateCart(((Trader) revealedUser).getId(), newPrefersJson))));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User cart not found, or other exception.", ex.getMessage()));
        }
    }

}
