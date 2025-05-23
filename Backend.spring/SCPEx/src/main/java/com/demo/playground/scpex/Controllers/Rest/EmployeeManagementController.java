package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Pojo.OperationRequest;
import com.demo.playground.scpex.Models.Pojo.PageRequest;
import com.demo.playground.scpex.Services.EmployeeSvc;
import com.demo.playground.scpex.Services.Logics.EmployeeManagement;
import com.demo.playground.scpex.Shared.NullReferenceException;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/e")
public class EmployeeManagementController {

    @Autowired
    EmployeeSvc _s;

    @Autowired
    EmployeeManagement _e;


    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_USERS')")
    @PostMapping("/{id}")
    public ResponseEntity<String> getEmployee(@PathVariable("id") String id) {
        Employee result;
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
        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result))); // 418
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_USERS')")
    @PostMapping("/find/{page}")
    public ResponseEntity<String> getEmployees(@PathVariable("page") String page, @RequestBody String body) {
//        System.out.println("header: " + authToken);
        Page<Employee> result;
        PageRequest pr = SharedStatic.jsonHandler.fromJson(body, PageRequest.class);
        int toPage = Integer.parseInt(page);
        try{
            result = _s.getPageObjects(pr, toPage);
        }
        catch (Exception ex){
            System.out.println(ex.getMessage());
            return ResponseHelper.Return(new Response(514, "Unknown, maybe not exist"));
        }

        for(var nx : result)
            nx.secure();

        return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(result)));
    }

    @PreAuthorize("hasAnyAuthority('PERMISSION_MANAGE_USERS')")
    @PostMapping("/op")
    public ResponseEntity<String> emplControls(
            @RequestBody
            String info//,
    ) {
        // IN: JSON, of OperationRequest
        try {
            OperationRequest or = SharedStatic.jsonHandler.fromJson(info, OperationRequest.class);
            var target = SharedStatic.jsonHandler.fromJson(or.payloadJson(), Employee.class);
            var isAlreadyExist = _s.isThisExist(target.getId());

            switch (or.operation()){
                case "add":
                    return _e.createEmployee(target, isAlreadyExist);

                case "upd":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    if(target.getPasswd().equals("hidden"))  // if passwd from frontend is hidden, then meaning the passwd no need to be updated.
                        target.setPasswd(_s.getObjectById(target.getId()).getPasswd());
                    _s.update(target);
                    break;

                case "del":
                    if(!isAlreadyExist) return ResponseHelper.Return(new Response(406, "Target not exist"));
                    _s.delete(target);
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


}
