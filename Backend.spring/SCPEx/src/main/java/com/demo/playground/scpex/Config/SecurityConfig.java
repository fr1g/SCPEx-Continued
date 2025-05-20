package com.demo.playground.scpex.Config;

import com.demo.playground.scpex.Services.UserDetailSvc;
import com.demo.playground.scpex.utils.MD5Helper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtFilterConfig jwtAuthenticationFilter; // ...config?

    public SecurityConfig(JwtFilterConfig jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        r ->   r // /api/products
                                .requestMatchers(HttpMethod.POST, "/api/auth/**")
                                .permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/login")
                                .permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/products/**")
                                .permitAll()
                                .anyRequest()
                                .authenticated()
                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint())
                        .accessDeniedHandler(accessDeniedHandler())
                )
//                .addFilterAt(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
//                .addFilterAfter(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        ;

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        System.out.println("passed through");
        return (request, response, authException) -> {
            authException.printStackTrace();
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Authentication is required\"}");
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"You don't have permission to access this resource\"}");
        };
    }

    @Autowired
    MD5Helper md5Helper;

    @Bean
    public PasswordEncoder passwordEncoder() {
        var prefix = "gabxd";
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        var encoder = md5Helper;
//        var encoder = new MD5Helper();
        encoders.put("noop", NoOpPasswordEncoder.getInstance());
        encoders.put(prefix, encoder);
        //        dele.setDefaultPasswordEncoderForMatches(encoder);
        return new DelegatingPasswordEncoder(prefix, encoders);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserDetailSvc userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config,
            DaoAuthenticationProvider authenticationProvider
    ) throws Exception {
        return new ProviderManager(authenticationProvider);
    }

//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager(); // authController todo: [TRUTH]  ::  maybe not using this, but using other instance as it.
//    }
}