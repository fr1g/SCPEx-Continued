package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Category;
import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Enums.GeneralStatus;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Product;
import com.demo.playground.scpex.Repositories.RepoCategory;
import com.demo.playground.scpex.Services.Logics.WarehouseManager;
import com.demo.playground.scpex.Services.ProductSvc;
import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.JwtHelper;
import com.demo.playground.scpex.utils.ResponseHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseManagementController {

    @Autowired
    ProductSvc _s;

    @Autowired
    WarehouseManager _w;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    UserDetailSvc _u;

    @Autowired
    RepoCategory _r_c;

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/{id}")
    public ResponseEntity<String> getProduct(@PathVariable("id") String id) {
        Product result;
        Long target;
        try {
            target = Long.parseLong(id);
            result = _s.getObjectById(target);
        } catch (NullReferenceException e){
            return ResponseHelper.Return(new Response(200, "No Such result: " + id));
        } catch (NumberFormatException e) {
            return ResponseHelper.Return(new Response(514, "Invalid request: ID"));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }
        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result))); // 418
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/find/{page}")
    public ResponseEntity<String> getTraders(@PathVariable("page") String page, @RequestBody String body) {
//        System.out.println("header: " + authToken);
        Page<Product> result;
        PageRequest pr = SharedStatic.jsonHandler.fromJson(body, PageRequest.class);
        try{
            result = _s.getPageObjects(pr, Integer.parseInt(page));
        }
        catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }

        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result)));
    }

    // todo still need a warehouse-name based searcher (optional, after basic IS completed)

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/op")
    public ResponseEntity<String> controls(
            @RequestBody
            String info//,
    ) {
        // IN: JSON, of OperationRequest
        try {
            OperationRequest or = SharedStatic.jsonHandler.fromJson(info, OperationRequest.class);
            var target = SharedStatic.jsonHandler.fromJson(or.payloadJson(), Product.class);
            var isAlreadyExist = _s.isThisExist(target.getId());

            switch (or.operation()){
                case "add":
                    return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(_w.createProduct(target))));

                case "upd":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    _s.update(target);
                    break;

                case "del":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    target.setStatus(GeneralStatus.CANCELED);
                    _s.update(target);
                    break;

                default:
                    return ResponseHelper.Return(new Response(514, "Unknown operation"));
            }


        }catch (NullReferenceException ex){
            if(ex.getMessage().contains("NM")) return ResponseHelper.Return(new Response(500, "Not acceptable operation."));
            else return ResponseHelper.Return(new Response(500, "Exception: " + ex.getMessage()));
        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(555));
        }
        return ResponseHelper.Return(new Response(200, "success"));
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/cat/new")
    public ResponseEntity<String> newCat(@RequestBody String body, @RequestHeader(name = "Authorization") String token) {
        try{
            var operator = (Employee)_u.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            var newItem = _w.addCategory(SharedStatic.jsonHandler.fromJson(body, Category.class), operator);

            return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(newItem)));

        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/cat/{id}")
    public ResponseEntity<String> getCat(@PathVariable("id") long id) {
        try{
            // is this really useful?
            return ResponseHelper.Return(new Response(200, "success", (new Gson()).toJson(_r_c.findById(id).orElseThrow(() -> new NullReferenceException("nothing found")))));
        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/cat/list")
    public ResponseEntity<String> listCat() {
        try{
            return ResponseHelper.Return(new Response(200, "listed.", (new Gson()).toJson(_r_c.findAll())));
        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_INVENTORY')")
    @PostMapping("/cat/disable/{id}")
    public ResponseEntity<String> giveUpCat(@PathVariable("id") long id, @RequestHeader(name = "Authorization") String token) {
        try{
            var original = _r_c.findById(id).orElseThrow(() -> new NullReferenceException("No such product CAT"));
            var operator = (Employee)_u.loadUserByUsername(jwtHelper.getUsernameFromToken(token));
            _w.disableCategory(original, operator);
            return ResponseHelper.Return(new Response(200, "success"));
        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }
    }

}
