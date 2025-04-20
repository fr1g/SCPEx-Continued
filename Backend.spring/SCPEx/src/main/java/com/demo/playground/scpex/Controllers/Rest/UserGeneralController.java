package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.AuthHelper;
import com.demo.playground.scpex.utils.EnhancedPageHelper;
import com.demo.playground.scpex.utils.ResponseHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v0/user")
public class UserGeneralController {
    /** TODO
     *    - Customer.CartTemporary.Add
     *    - Customer.CartTemporary.Remove
     *    - Seller.CreateSellRequest
     *    - Seller.CancelSellRequest
     *    -
     *    -
     *
     * */
    @Autowired
    private RepoTrader _trader;

    @Autowired
    private RepoEmployee _employee;

    @GetMapping("/passwd")
    public ResponseEntity<String> getPasswd() {
        return ResponseHelper.Return(new Response(200, "Password generated. Not via Caesar or Vigenère ", AuthHelper.generatePasswd()));
    }

    @PostMapping("/t/{control}")
    public  ResponseEntity<String> acquireTraderInfoEnhanced(@PathVariable String control, @RequestBody String body) {
        System.out.println(control);
        int forPage = 1;
        try{
            forPage = Integer.parseInt(control);
        } catch (Exception ex){ }
        try {
            // testing the function of enhanced reflect name search
            if(forPage < 1) forPage = 1;
            var details = SharedStatic.jsonHandler.fromJson(body, PageRequest.class);

            var epage = new EnhancedPageHelper<Trader, RepoTrader>(_trader, SharedStatic.pageSize);
            Page<Trader> result;

            if(details.SortingField == "name"){
                result = _trader.findByNameContaining(details.Keyword, epage.of(forPage, "name"));
            }
//                result = epage.getPage("findByNameContain", new LinkedHashMap<Class<?>, Object>(){{
//                    put(Pageable.class, null);
//                    put(String.class, details.Keyword);
//                }}, // is this possible to run with lambda?
//                    forPage, details.PageSize, details.Field, details.SortBy);

            else  /* getPageSortingById */
                result = _trader.findAll(epage.of(forPage));



            return ResponseHelper.Return(new Response(SharedStatic.jsonHandler.toJson(result)));

        }catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseHelper.Return(new Response(514));
    }


}
