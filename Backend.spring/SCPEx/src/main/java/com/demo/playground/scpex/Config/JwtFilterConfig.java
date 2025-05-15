package com.demo.playground.scpex.Config;

import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.utils.JwtHelper;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilterConfig extends OncePerRequestFilter {
    private final UserDetailSvc userDetailsService;
    private final JwtHelper jwtUtil;

    public JwtFilterConfig(UserDetailSvc userDetailsService, JwtHelper jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null, jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                var isWaste = jwtUtil.isInInvalidated(jwt);
                if (isWaste)
                    throw new JwtException("Invalid JWT token");
                // prevent invalidated(s)...
                username = jwtUtil.getUsernameFromToken(jwt); // got username with head
            } catch (Exception e) {
                sendErrorResponse(response, "Invalid Token");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // user name not constructed as type-contained.
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            boolean isUserAsCustomer = userDetails.getAuthorities().contains(new SimpleGrantedAuthority("PERMISSION_PURCHASE"));
            if (jwtUtil.validateToken(jwt)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                sendErrorResponse(response, "Token Expired");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    // interupter
    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"status\":401,\"message\":\"" + message + "\"}"); // todo status or code?
        response.getWriter().flush();
    }
}
