package com.demo.playground.scpex.utils;

import com.demo.playground.scpex.Models.Pojo.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtHelper {
//    @Value("${jwt.secret}")
    private SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private final Long expiration = 43200L;

    public String generateToken(User userDetails, boolean remember) {
        System.out.println("Remember: " + remember);
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(/*(userDetails.isTrader() ? "t/" : "e/") + */ // not needed: the front-end passes login with the required form.
                        userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000 * (remember ? 20 : 1)))
                .signWith(secret) // ignoring deprecated method. my time is not enough.
                .compact();
    }

    public boolean validateToken(String token, boolean isTrader) {
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

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
