package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/t")
public class TraderManagementController {

    @Autowired
    private RepoTrader _t;

    @Autowired
    private RepoEmployee _e;

    @PostMapping("/{id}")
    public ResponseEntity<String> getTrader(@PathVariable("id") Long id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authToken) {
        System.out.println("header: " + authToken);

        Trader result;
        Long target;
        try {
            target = Long.parseLong(authToken);
            result = _t.findById(target).orElseThrow(() -> new NullReferenceException("Trader not found"));
        } catch (NullReferenceException e){
            return ResponseHelper.Return(new Response(200, "No Such User of Trader: " + id));
        } catch (NumberFormatException e) {
            return ResponseHelper.Return(new Response(514, "Invalid request: Trader ID"));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }
        result.secure();
        result.getRegistrar().secure();
        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result))); // 418
    }

    @PostMapping("/op")
    public ResponseEntity<String> createTrader(@RequestBody String info) {

        try {
            Trader trader = SharedStatic.jsonHandler.fromJson(info, Trader.class);

            var isExist = _t.existsById(trader.getId());
            if(trader == null || trader.getRegistrar() == null) throw new NullReferenceException("Trader or Registrar not found");
            else // if trader already exists or the target registrar doesnt exist
                if( !_e.existsById(trader.getRegistrar().getId())) {
                // just wrong registrar:
                trader.setRegistrar(_e.findById(0l).orElseThrow()); // todo every startup must check for default account exist or not

            } else if(isExist){ // trader exists:
                var redux = SharedStatic.jsonHandler.fromJson(info, OperationRequest.class);
            }
        }catch (Exception ex){

        }
        return ResponseHelper.Return(new Response(200, "success"));
    }
}
