package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.*;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Enums.Type;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Pojo.User;
import com.demo.playground.scpex.Repositories.RepoCN;
import com.demo.playground.scpex.Services.Logics.TraderUsage;
import com.demo.playground.scpex.Services.Logics.TransactionProcedure;
import com.demo.playground.scpex.Services.TraderSvc;
import com.demo.playground.scpex.Services.TransactionSvc;
import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.utils.AuthHelper;
import com.demo.playground.scpex.utils.JwtHelper;
import com.demo.playground.scpex.utils.ResponseHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.PermissionDeniedDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;


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
    @Autowired
    private UserDetailSvc userDetailSvc;

    @PostMapping("/trades/query/{page}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE', 'PERMISSION_MANAGE_INVENTORY')")
    public ResponseEntity<String> queryTrades(@RequestHeader(name = "Authorization") String tokenRaw, @RequestBody String pageReq, @PathVariable("page") int pageNum){
        try {
            var token = AuthHelper.unbear(tokenRaw);
            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));

            var page = (new Gson()).fromJson(pageReq, PageRequest.class);

            String res;
            if(revealedUser.isCustomer()) {
                var got = _logic.getPagedTrades(page.toPageable(pageNum), (Trader)revealedUser);
                res = (new Gson()).toJson(got);
            }
            else if(revealedUser.getType().equals(Type.ADMIN) || revealedUser.getType().equals(Type.WAREHOUSE)) {
                var got = _logic.getPagedTrades(page.toPageable(pageNum));
                res = (new Gson()).toJson(got);
            }

            else throw new NullReferenceException("Not correct role.");

            return ResponseHelper.Return(new Response(200, "done", res));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User Cart not found, or other exception.", ex.getMessage()));
        }
    }
    // todo: update transaction by id; else.
    @PostMapping("/trades/update/{transactionId}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')") // only warehouse and admin.
    public ResponseEntity<String> updateTransaction(@RequestBody String indexText, @PathVariable("transactionId") long targetId) {
        try {
            var parsedIndex = (int)Double.parseDouble(indexText.replaceAll("\"", "").replaceAll("'", "").trim());
            _logic.updateTransaction(targetId, parsedIndex);
//            var newState = (new Gson()).fromJson(newTransactionStateJson, Transaction.class);
//            if(!_trans.isThisExist(targetId)) throw new NullReferenceException("No such transaction");
//            newState.setDateUpdated((new Date()));
//            _trans.update(newState);

            return ResponseHelper.Return(new Response(200, "done"));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(404, "Failed to update.", ex.getMessage()));
        }
    }

    @PostMapping("/cn/create")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> createContractNegotiation(@RequestHeader(name = "Authorization") String tokenRaw, @RequestBody String cnJson) {
        try {
            String token = AuthHelper.unbear(tokenRaw);
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
    public ResponseEntity<String> getPagedCNs(@RequestHeader(name = "Authorization") String tokenRaw, @RequestBody String pageReqJson, @PathVariable("pageNum") int pageNum) {
        try {
            String token = AuthHelper.unbear(tokenRaw);

            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if((revealedUser.isCustomer() || !revealedUser.isTrader() && !(revealedUser.getType().equals(Type.WAREHOUSE) || revealedUser.getType().equals(Type.ADMIN))))
                // is !(warehouse, seller, admin) // todo if something bad happened, try to replace with it.
                return ResponseHelper.Return(new Response(403, "Insufficient permission."));

            var pageable = (new Gson()).fromJson(pageReqJson, PageRequest.class).toPageable(pageNum);
            var result = ((revealedUser.isTrader()) ? _cn.findAllOfSeller(revealedUser.getId(), pageable) : _cn.findAll(pageable)).map(x -> {
                // todo maybe cause error: else not need to secure, maybe the returned data never contains any need-to-secure stuff?
                var t = (Trader) ((ContractNegotiation)x).getSender().secure();
                t.setRegistrar((Employee) t.getRegistrar().secure());
                ((ContractNegotiation)x).setSender(t);
                return x;
            });
            return ResponseHelper.Return(new Response(200, "Result Presented", (new Gson()).toJson(result)));
        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(403, "Not allowed. ", ex.getMessage()));
        }
    }

    @PostMapping("/cn/approve/{id}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    public ResponseEntity<String> updateCN(@RequestHeader(name = "Authorization") String tokenRaw, @PathVariable long id) {
        try{
            // too easy controller won't use service
            String token = AuthHelper.unbear(tokenRaw);
            if(!jwtHelper.validateToken(token)) return ResponseHelper.Return(new Response(403, "invalid token"));
            var revealedUserName = jwtHelper.getUsernameFromToken(token);
            var revealedUser = (User)userDetailSvc.loadUserByUsername(revealedUserName);

            var operating = _cn.findById(id).orElseThrow(() -> new NullReferenceException("No such item. "));

            operating.setStatus(GeneralStatus.APPROVED);
            operating.setDescription( operating.getDescription() + " ... (At " + (new Date()) + ", cancelled by " + revealedUserName + ", ID: " + revealedUser.getId() + ")");


            _cn.saveAndFlush(operating);
            return ResponseHelper.Return(new Response(200, "done"));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "Sth wrong happened. ", ex.getMessage()));
        }
    }

    @PostMapping("/cn/cancel/{id}")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE', 'PERMISSION_MANAGE_INVENTORY')")
    public ResponseEntity<String> cancelCN(@RequestHeader(name = "Authorization") String tokenRaw, @PathVariable long id) {
        try{
            String token = AuthHelper.unbear(tokenRaw);
            if(!jwtHelper.validateToken(token)) return ResponseHelper.Return(new Response(403, "invalid token"));
            var revealedUserName = jwtHelper.getUsernameFromToken(token);
            var revealedUser = (User)userDetailSvc.loadUserByUsername(revealedUserName);

            var operating = _cn.findById(id).orElseThrow(() -> new NullReferenceException("No such item. "));
            if(!operating.getStatus().equals(GeneralStatus.CANCELED)){
                operating.setStatus(GeneralStatus.CANCELED);
                if( ! (revealedUser.isTrader() && !revealedUser.isCustomer()) /* not seller */ )
                    operating.setDescription( operating.getDescription() + " ... (At " + (new Date()) + ", cancelled by " + revealedUserName + ", ID: " + revealedUser.getId() + ")");
            } else operating.setStatus(GeneralStatus.PENDING);

            _cn.saveAndFlush(operating);
            return ResponseHelper.Return(new Response(200, "done"));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "Sth wrong happened. ", ex.getMessage()));
        }
    }


    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> createTrade(@RequestHeader(name = "Authorization") String tokenRaw, @RequestBody String chosenAddressJson){
        //  using current cart to create trade
        try{
            String token = AuthHelper.unbear(tokenRaw);

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
    public ResponseEntity<String> updateAddress(@RequestHeader(name = "Authorization") String tokenRaw, @RequestBody String addressJson){
        try{
            String token = AuthHelper.unbear(tokenRaw);

            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));

            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(_t_u.updateLocation(revealedUser.getId(), addressJson))));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User addr-book not found, or other exception.", ex.getMessage()));
        }
    }

    // in product's page
    @PostMapping("/cart/add")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> addToCart(@RequestHeader(name = "Authorization") String tokenRaw,
                                            @RequestBody String tuple){
        // the operation inside the product info page, add in touch.
        try{
            String token = AuthHelper.unbear(tokenRaw);

            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));

            System.out.println(tuple);

            long[] parsedTuple = new long[2]; // [productId, quantity]
            int index = 0;
            for(var x : tuple.replaceAll("\"", "").split(",")){
                parsedTuple[index] = Long.parseLong(x.trim());
                index++;
            }

            var result = _t_u.addToCart(((Trader) revealedUser).getId(), parsedTuple[0], (int)parsedTuple[1]); // not that good...
            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(result)));


        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(403, "User cart not found, or other exception.", ex.getMessage()));

        }
    }

    // in cart management page
    @PostMapping("/cart/update")
    @PreAuthorize("hasAnyAuthority('PERMISSION_PURCHASE')")
    public ResponseEntity<String> updateCart(@RequestHeader(name = "Authorization") String tokenRaw,
                                             @RequestBody String newPrefersJson){
        try {
            String token = AuthHelper.unbear(tokenRaw);

            var revealedUser = (User)_us.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            // well, actually, this MUST BE a user type of trader...
            if(!revealedUser.isTrader()) return ResponseHelper.Return(new Response(403, "This is not a trader."));
            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(_t_u.updateCart(((Trader) revealedUser).getId(), newPrefersJson))));
        }catch (Exception ex){
            return ResponseHelper.Return(new Response(403, "User cart not found, or other exception.", ex.getMessage()));
        }
    }

}
