package com.demo.playground.scpex.Services.Logics;

import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Services.TraderSvc;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.Shared.SharedStatic;
import com.demo.playground.scpex.utils.AuthHelper;
import com.demo.playground.scpex.utils.MD5Helper;
import com.demo.playground.scpex.utils.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TraderManagement {

    @Autowired
    TraderSvc _s;

    public ResponseEntity<String> createTrader(Trader target, boolean isAlreadyExist) {
        if(isAlreadyExist)
            return ResponseHelper.Return(new Response(406, "Trader already exists", "Use 0 for new user, or use \"upd\" to update this existed user."));
        else{
            target.setId(null);
            String originalPasswd = AuthHelper.generatePasswd();
            target.setPasswd(MD5Helper.encrypt(originalPasswd));
            _s.add(target);
            return ResponseHelper.Return(new Response(200, "success", SharedStatic.jsonHandler.toJson(target.withPasswd(originalPasswd))));
        }

    }
}
