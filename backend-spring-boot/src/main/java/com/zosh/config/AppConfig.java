package com.zosh.config;

import java.util.Arrays;
import java.util.Collections;

import com.bedatadriven.jackson.datatype.jts.JtsModule;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
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

@Configuration
@EnableWebSecurity
public class AppConfig {
    private final ObjectMapper objectMapper;

    public AppConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(Authorize -> Authorize
                        .requestMatchers("/api/user/register").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/merchant").permitAll()
                        .requestMatchers("/api/product/getAll").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/merchant/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/getone/*").permitAll()
                        .requestMatchers("/api/v1/payment/*").permitAll()
                        .requestMatchers("/api/order/create").permitAll()
                        .requestMatchers("/api/order/*/status").permitAll()

                        .requestMatchers("/api/admin/**").hasAnyRole("RESTAURANT_OWNER","ADMIN")
                        .requestMatchers("/api/**").authenticated()

                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

		return http.build();
	}
	
    // CORS Configuration
    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(Arrays.asList(
                    "http://localhost:3000",
                    "https://zosh-food.vercel.app",
                    "http://localhost:4200"
                ));
                cfg.setAllowedMethods(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setExposedHeaders(Arrays.asList("Authorization"));
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }

    @Bean
    PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

    @PostConstruct
    public void registerJtsModule() {
        // Đăng ký JtsModule - Giúp map đối tượng Point của jts thành kiểu dữ liệu customize đơn giản
        objectMapper.registerModule(new JtsModule());
    }

    @Bean
    public GeometryFactory geometryFactory() {
        // Tham số: PrecisionModel (độ chính xác), SRID (hệ tham chiếu không gian)
        return new GeometryFactory(new PrecisionModel(), 4326);
    }

}
