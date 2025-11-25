package com.zosh.config;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Collections;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class AppConfig {
    private static final Logger logger = LoggerFactory.getLogger(AppConfig.class);
    private final ObjectMapper objectMapper;

    public AppConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(Authorize -> Authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/user/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/merchant").permitAll()
                        .requestMatchers("/api/product/getAll").permitAll()
                        //.requestMatchers(HttpMethod.GET, "/api/merchant/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/getone/*").permitAll()
                        .requestMatchers("/api/v1/payment/*").permitAll()
                        .requestMatchers("/api/order/create").permitAll()
                        .requestMatchers("/api/order/*/status").permitAll()

                        .requestMatchers("/api/**").authenticated()

                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authEx) -> {
                            logger.warn("Unauthenticated request to {}: {}", request.getRequestURI(), authEx.getMessage());
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"unauthenticated\",\"message\":\"" + authEx.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessEx) -> {
                            logger.warn("Access denied to {}: {}", request.getRequestURI(), accessEx.getMessage());
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"forbidden\",\"message\":\"" + accessEx.getMessage() + "\"}");
                        })
                );

        return http.build();
    }

    // CORS Configuration
    private CorsConfigurationSource corsConfigurationSource() {
        // whitelist các origin bạn dùng — dùng patterns để cover vercel preview + trycloudflare
        List<String> whitelist = Arrays.asList(
                "http://localhost:30000",
                "http://localhost:3000",
                "http://localhost:4200",
                "https://drone-fastfood-delivery.vercel.app",
                "https://drone-fastfood-delivery-a6ldzeu4t-chins-projects-6b5b149f.vercel.app",
                "https://ichthyolitic-vashti-adminicular.ngrok-free.dev",
                "https://*.trycloudflare.com" // allow cloudflared quick tunnels
        );

        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();

            // Prefer allowedOriginPatterns for flexibility with wildcards
            cfg.setAllowedOriginPatterns(Arrays.asList(
                    "http://localhost:*",
                    "https://*.vercel.app",
                    "https://*.trycloudflare.com",
                    "https://*.ngrok-free.dev"
            ));

            cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            cfg.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
            cfg.setExposedHeaders(Arrays.asList("Authorization"));
            cfg.setAllowCredentials(true);
            cfg.setMaxAge(3600L);

            // Optional: if you still want to only allow exact origins from whitelist,
            // uncomment below: (keeps echo behavior)
            /*
            String origin = request.getHeader("Origin");
            if (origin != null && whitelist.contains(origin)) {
                cfg.setAllowedOrigins(Collections.singletonList(origin));
            } else {
                cfg.setAllowedOrigins(Collections.emptyList());
            }
            */

            return cfg;
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @PostConstruct
    public void registerJtsModule() {
        // Đăng ký JtsModule
        objectMapper.registerModule(new JtsModule());
    }

    @Bean
    public GeometryFactory geometryFactory() {
        return new GeometryFactory(new PrecisionModel(), 4326);
    }

}
