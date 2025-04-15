package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Repositories.RepoEmployee;
import com.demo.playground.scpex.Repositories.RepoTrader;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.GeneralSpecificationHelper;
import com.demo.playground.scpex.utils.ResponseHelper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    @PostMapping("/find/{page}")
    public ResponseEntity<String> getTraders(@RequestHeader(HttpHeaders.AUTHORIZATION) String authToken, @PathVariable("page") String page, @RequestBody String body) {
        System.out.println("header: " + authToken);
        Page<Trader> result;
        PageRequest pr = SharedStatic.jsonHandler.fromJson(body, PageRequest.class);
        int toPage = Integer.parseInt(page);
        try{
            if(pr.Field.equals("default") || pr.Field.equalsIgnoreCase("id"))
                result = _t.findAll(pr.toPageable(toPage));
            else
                result = _t.findAll(
                        (new GeneralSpecificationHelper<Trader>())
                                .like(  pr.Field.toLowerCase(),
                                        pr.Keyword.toLowerCase()  ),
                    pr.toPageable(toPage)
                );
        }
        catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }

        for(var nx : result)
            nx.secure();

        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result)));
    }

    @PostMapping("/op")
    public ResponseEntity<String> createTrader(
            @RequestHeader(HttpHeaders.AUTHORIZATION)
            String authToken,
            @RequestBody
            String info
    ) {
        // IN: JSON, of OperationRequest
        try {
            OperationRequest or = SharedStatic.jsonHandler.fromJson(info, OperationRequest.class);
            var target = SharedStatic.jsonHandler.fromJson(or.payloadJson(), Trader.class);
            var isAlreadyExist = _t.existsById(target.getId());
            switch (or.operation()){
                case "add":
                    if(isAlreadyExist)
                        return ResponseHelper.Return(new Response(406));
                    else if(!_e.existsById(target.getRegistrar().getId()))
                        ResponseHelper.Return(new Response(406));
                    else
                        _t.save(target);

                    break;

                case "upd":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    var original = _t.findById(target.getId()).orElseThrow(() -> new NullReferenceException("Trader not found: No such record."));
                    target.setPasswd(original.getPasswd());
                    _t.save(target);
                    break;

                case "del":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    var o = _t.findById(target.getId()).orElseThrow(() -> new NullReferenceException("Trader not found: No such record."));
                    _t.delete(o);
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
