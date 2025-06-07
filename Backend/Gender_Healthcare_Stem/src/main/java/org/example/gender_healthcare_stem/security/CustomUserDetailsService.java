// src/main/java/org/example/gender_healthcare_stem/security/CustomUserDetailsService.java
package org.example.gender_healthcare_stem.security;

import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repo.findByEmail(email)
                .map(u -> User.withUsername(u.getEmail())
                        .password(u.getPasswordHash())
                        .authorities(u.getRole())   // map role → GrantedAuthority
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
