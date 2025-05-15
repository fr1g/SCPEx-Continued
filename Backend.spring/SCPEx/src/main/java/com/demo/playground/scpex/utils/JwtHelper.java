package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.Pojo.User;
import com.demo.playground.scpex.Shared.NullReferenceException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class JwtHelper {
//    @Value("${jwt.secret}")
    private SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private ConcurrentHashMap<Long, String> invalidated = new ConcurrentHashMap<>();
    private final Long expiration = 43200L;

    public boolean isInInvalidated(String token) {
        return invalidated.containsValue(token);
    }

    public String generateToken(User userDetails, boolean remember) {
        System.out.println("Remember: " + remember);
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(/*(userDetails.isTrader() ? "t/" : "e/") + */ // not needed: the front-end passes login with the required form.
                        // well actually required. the login will be reformed internal.
                        (userDetails.isTrader() ? "t#" : "e#") + "cont#" + userDetails.getUsername()
                )
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000 * (remember ? 20 : 1)))
                .signWith(secret) // ignoring deprecated method. my time is not enough.
                .compact();
    }

    public boolean validateToken(String token) {
        if(invalidated.containsValue(token))
            return false;

        try {
            Jwts.parserBuilder().setSigningKey(secret).build().parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
            ex.printStackTrace();
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }


    public void invalidateToken(String token) {
        var realToken = token;
        if(token.startsWith("Bearer")) realToken = token.substring(7);
        if(validateToken(realToken)) {
            invalidated.put((new Date()).getTime(), realToken);
        } else throw new NullReferenceException("No record on the token");
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
