package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.EnhancedPageHelper;
import com.demo.playground.scpex.utils.PageHelper;
import com.demo.playground.scpex.utils.ResponseHelper;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserGeneralController {
    /** TODO
     *    - Customer.CartTemporary.Add
     *    - Customer.CartTemporary.Remove
     *    - Seller.CreateSellRequest
     *    - Seller.CancelSellRequest
     *    -
     *
     * */
    @Autowired
    private RepoTrader _trader;

    @Autowired
    private RepoEmployee _employee;

    @PostMapping("/t-enhanced/{control}")
    public  ResponseEntity<String> acquireTraderInfoEnhanced(@PathVariable String control) {
        System.out.println(control);
        try {
            // testing the function of enhanced reflect name search
            var args = control.split("XXX");
            var epage = new EnhancedPageHelper<Employee, RepoEmployee>(_employee, SharedStatic.pageSize);
            var result = epage.getPage("ofName", new LinkedHashMap<Class<?>, Object>(){{
                put(Pageable.class, null);
                put(String.class, args[0]);
            }}, Integer.parseInt(args[1]), 0, "name", "default");
            System.out.println(result.hasNext() + " " + result.hasNext());
//            System.out.println(_employee.ofName(epage.of()));
            return ResponseHelper.Return(new Response(SharedStatic.jsonHandler.toJson(result)));

        }catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseHelper.Return(new Response(514));
    }

    @PostMapping("/t/{control}")
    public ResponseEntity<String> acquireTraderInfo(@PathVariable String control) {
        try {
            if(control.startsWith("#")){
                long target = Long.parseLong(control.replace("#",""));

                // of exactly id
                Employee result = _employee.get(target);
                return ResponseHelper.Return(new Response(SharedStatic.jsonHandler.toJson(result)));
            }else if(control.contains("-")){
                String[] range = control.split("-");
                if(range.length != 2) throw new Exception("wrong range");
                int from = Integer.parseInt(range[0]), to = Integer.parseInt(range[1]);

                // from-to "range" scheme (alpha)
                List<Employee> result = _employee.get(PageHelper.getLimit(to, PageHelper.size(from, to)));
                return ResponseHelper.Return(new Response(SharedStatic.jsonHandler.toJson(result)));

            }else if(control.contains("+")){
                String[] range = control.split("\\+");
                if(range.length != 2) throw new Exception("wrong pair");

                // target page + size
                int target = Integer.parseInt(range[0]),
                    size = (Integer.parseInt(range[1]) <= 0 ? SharedStatic.pageSize : Integer.parseInt(range[1]));
                List<Employee> result = _employee.get(size, PageHelper.at(target, size));
                return ResponseHelper.Return(new Response(SharedStatic.jsonHandler.toJson(result)));
            } else{

                // search by name
                List<Employee> result = _employee.ofName(control);
                return ResponseHelper.Return(new Response(SharedStatic.jsonHandler.toJson(result)));
            }
        }catch (Exception e) {
            return ResponseHelper.Return(new Response(514, e.getMessage()));
        }
    }


}
