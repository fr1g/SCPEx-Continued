package com.demo.playground.scpex.Config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Scanner;

public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8080,http://127.0.0.1:8080")// can add more via config but here let's skip it.
                .maxAge(3600)
                .allowCredentials(true)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}
