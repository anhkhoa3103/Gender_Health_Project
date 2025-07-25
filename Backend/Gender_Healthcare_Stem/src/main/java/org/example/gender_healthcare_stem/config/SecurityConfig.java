package org.example.gender_healthcare_stem.config;

import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.auth.security.JwtAuthenticationFilter;
import org.example.gender_healthcare_stem.auth.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/auth/oauth/google").permitAll()
                        .requestMatchers("/api/feedback/**").permitAll()
                        .requestMatchers("/api/consultation-invoices/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menstrual/cycle-history/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/consultation/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/consultants/getall").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/feedbacks/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/feedbacks/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/appointments/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sti/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/invoice").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/consultationpayment/vnpay-create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/consultationpayment/vnpay-return").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/invoice/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/invoice/vnpay-create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/invoice/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/package/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/package/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/test-results/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/test-results/**").permitAll()
                        .requestMatchers("/api/test-results/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sti-appointment/staff/all").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/sti-appointment/staff/update-status/**").permitAll()
                        .requestMatchers("/api/consultants/**").hasAuthority("ROLE_CONSULTANT")
                        .requestMatchers("/api/staff/**").hasAuthority("ROLE_STAFF")
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:3000")); // React frontend
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
