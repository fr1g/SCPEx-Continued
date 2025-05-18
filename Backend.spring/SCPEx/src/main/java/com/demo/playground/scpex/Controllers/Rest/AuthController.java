package com.demo.playground.scpex.Controllers.Rest;

import com.demo.playground.scpex.Models.Employee;
import com.demo.playground.scpex.Models.Pojo.LoginCredentials;
import com.demo.playground.scpex.Models.Pojo.User;
import com.demo.playground.scpex.Models.Trader;
import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.Shared.Response;
import com.demo.playground.scpex.utils.JwtHelper;
import com.demo.playground.scpex.utils.ResponseHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailSvc _u;
    @Autowired
    private JwtHelper jwtHelper;

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody String body) {
        // actually need to recognize different type of login.
        var loginRequest = (new Gson()).fromJson(body, LoginCredentials.class);
        if(!loginRequest.username.contains("#"))
            loginRequest.username = "t#uid#" + loginRequest.username;

//        loginRequest.password = "{GABXD}" + loginRequest.password;
        var auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.username,
                loginRequest.password)
        );
        if(auth.isAuthenticated()){ // if authenticated, then the user must be existing.
            User u = (User)auth.getPrincipal();
            String token = jwtHelper.generateToken(u, loginRequest.remember);
            User realUser = (User)_u.loadUserByUsername(loginRequest.username);
            if(realUser.isTrader()){
                Trader loginUser = (Trader)realUser;
                loginUser.setPasswd(token);
                return ResponseHelper.Return(new Response(200, "trader logged in", (new Gson()).toJson(loginUser)));
            } else {
                Employee loginUser = (Employee)realUser;
                loginUser.setPasswd(token);
                return ResponseHelper.Return(new Response(200, "employee logged in", (new Gson()).toJson(loginUser)));
            }
        }

        return ResponseHelper.Return(new Response(403, "invalid"));
    }

    @PostMapping("logoff")
    public ResponseEntity<String> logout(@RequestHeader(name = "Authorization") String token) {
        // I HOPE: todo THE USER WITH DIFFERENT IP WILL AUTOMATICALLY LOG-OFF.
        // but i have no time to do so. that's a pity...
        // only can logoff-self.
        jwtHelper.invalidateToken(token);
        return ResponseHelper.Return(new Response(200, "logged out"));
    }

    @PostMapping("getme")
    public ResponseEntity<String> getMe(@RequestHeader(name = "Authorization") String token) {
        if(!jwtHelper.validateToken(token)) return ResponseHelper.Return(new Response(403, "invalid token"));

        var revealedUserName = jwtHelper.getUsernameFromToken(token);
        var revealedUser = (User)_u.loadUserByUsername(revealedUserName);
        var isUserATrader = revealedUser.isTrader();
        if(isUserATrader){
            return ResponseHelper.Return(new Response(200, "TRA logged in", (new Gson()).toJson((Trader)revealedUser)));
        }
        else return ResponseHelper.Return(new Response(200, "EMP logged in", (new Gson()).toJson((Employee)revealedUser)));
        // seriously???
    }
}
