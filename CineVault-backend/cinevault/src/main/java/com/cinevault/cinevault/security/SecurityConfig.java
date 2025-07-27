package com.cinevault.cinevault.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Integrate CORS with Spring Security
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Define allowed origin patterns
        config.addAllowedOriginPattern("http://192.168.132.120:[*]"); // Allow any port on this IP (e.g., 8081, 19000)
        config.addAllowedOriginPattern("http://10.30.22.140:[*]"); // Allow any port on this IP (e.g., 8081, 19000)
        config.addAllowedOriginPattern("http://10.124.233.120:[*]"); // Allow any port on this IP (e.g., 8080, 3000)
        config.addAllowedOriginPattern("http://10.132.2.133:[*]"); // Allow any port on this IP (e.g., 8080, 3000)
        config.addAllowedOriginPattern("http://localhost:[*]"); // Allow any port on localhost (e.g., 19006)
        config.addAllowedOriginPattern("exp://10.124.233.120:[*]"); // Allow Expo URLs with any port
        config.addAllowedOriginPattern("exp://localhost:[*]"); // Allow Expo URLs with any port
        config.addAllowedOriginPattern("exp://10.132.2.133:[*]"); // Allow Expo URLs with any port

        config.setAllowCredentials(true); // Allow credentials (cookies, etc.)
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedHeader("*"); // Allow all headers
        config.setMaxAge(3600L); // Cache preflight response for 1 hour

        source.registerCorsConfiguration("/**", config); // Apply to all endpoints
        return source;
    }
}