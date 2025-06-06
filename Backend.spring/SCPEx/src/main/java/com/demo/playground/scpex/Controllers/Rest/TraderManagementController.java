package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Pojo.User;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Services.Logics.TraderManagement;
import com.demo.playground.scpex.Services.TraderSvc;
import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.AuthHelper;
import com.demo.playground.scpex.utils.JwtHelper;
import com.demo.playground.scpex.utils.MD5Helper;
import com.demo.playground.scpex.utils.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/t")
public class TraderManagementController {

    // SOLVED: traders cannot get other traders' info. need some way to prevent.
    // candidate 1: check if id equals to requiring trader
    // candidate 2: recommended: make every request being strict under privs. [SELECTED]

    @Autowired
    TraderSvc _s;

    @Autowired
    TraderManagement _t;
    @Autowired
    private JwtHelper jwtHelper;
    @Autowired
    private UserDetailSvc userDetailSvc;

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_REGISTRAR', 'PERMISSION_MANAGE_CUSTOMERS', 'PERMISSION_MANAGE_USERS')")
    @PostMapping("/{id}")
    public ResponseEntity<String> getTrader(@PathVariable("id") String id) {
//        System.out.println("header: " + authToken);

        Trader result;
        Long target;
        try {
            target = Long.parseLong(id);
            result = _s.getObjectById(target);
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

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_REGISTRAR', 'PERMISSION_MANAGE_CUSTOMERS', 'PERMISSION_MANAGE_USERS')")
    @PostMapping("/find/{page}")
    public ResponseEntity<String> getTraders(@PathVariable("page") String page, @RequestBody String body) {
//        System.out.println("header: " + authToken);
        Page<Trader> result;
        PageRequest pr = SharedStatic.jsonHandler.fromJson(body, PageRequest.class);
        int toPage = Integer.parseInt(page);
        try{
            if(pr.SortingField.equals("default") || pr.SortingField.equalsIgnoreCase("id"))
                result = _s.getPageObjects(pr, toPage);
            else
                result = _s.getSpecifiedPageObjects(pr, toPage);
            // necessary?
        }
        catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }

        for(var nx : result){
            nx.secure();
            nx.getRegistrar().secure();
        }

        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result)));
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_REGISTRAR', 'PERMISSION_MANAGE_CUSTOMERS', 'PERMISSION_MANAGE_USERS')")
    @PostMapping("/op")
    public ResponseEntity<String> traderControls(
            @RequestHeader(name = "Authorization") String tokenRaw,
            @RequestBody
            String info//,
    ) {
        // IN: JSON, of OperationRequest
        try {
            OperationRequest or = SharedStatic.jsonHandler.fromJson(info, OperationRequest.class);
            var target = SharedStatic.jsonHandler.fromJson(or.payloadJson(), Trader.class);
            var isAlreadyExist = _s.isThisExist(target.getId());
            if(
                    or.operation() != "add" &&
                    (target.getRegistrar() == null ||
                    target.getRegistrar().getId() < 0 ||
                    !_s.isRegistrarExist(target.getRegistrar().getId()))
                    // not exist
            ){

                return ResponseHelper.Return(new Response(406, "Registrar is null or not exist"));
            }
            String token = AuthHelper.unbear(tokenRaw);
            if(!jwtHelper.validateToken(token)) return ResponseHelper.Return(new Response(403, "invalid token"));
            var revealedUserName = jwtHelper.getUsernameFromToken(token);
            var revealedUser = (Employee)userDetailSvc.loadUserByUsername(revealedUserName);


            switch (or.operation()){
                case "add":
                    target.setRegistrar(revealedUser);
                    return _t.createTrader(target, isAlreadyExist);

                case "upd":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));

                    var rev = _s.getObjectById(target.getId());

                    if(target.getPasswd().equals("hidden"))  // if passwd from frontend is hidden, then meaning the passwd no need to be updated.
                        target.setPasswd(rev.getPasswd());

                    target.setCreatedDate(rev.getCreatedDate());
                    target.setBirth(rev.getBirth());
                    target.setLocationJson(rev.getLocationJson());
                    target.setNote(rev.getNote());
                    // if requires new passwd randomly generated by system, use that interface and let front end send new passwd to back. no need to write a new generating one.
                    // like: [xxxxxxx](generate passwd) ...
                    _s.update(target);
                    break;

                case "del":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    _s.delete(target);
                    break;

                default:
                    return ResponseHelper.Return(new Response(514, "Unknown operation"));
            }
                    /*  update object strategy
                    *   if EXIST on the GIVEN ID:
                    *       ! 增量更新法
                    *       ! 由于受到的来自前端的内容隐藏了部分内容
                    *       ! 为了避免隐藏值和空值错误地赋值到数据库 (比如 在前端的password字段将会是“hidden”)
                    *       ! 需要忽略特定值: 比如说, 将null忽略, 保留数据库值
                    *       ! 将“hidden”忽略, 继续使用数据库值
                    */

        }catch (NullReferenceException ex){
            if(ex.getMessage().contains("NM")) return ResponseHelper.Return(new Response(500, "Not acceptable operation."));
            else return ResponseHelper.Return(new Response(500, "Exception: " + ex.getMessage()));
        }catch (Exception ex){
            ex.printStackTrace();
            return ResponseHelper.Return(new Response(555));
        }
        return ResponseHelper.Return(new Response(200, "success"));
    }
}
