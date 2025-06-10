package org.example.gender_healthcare_stem.auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.example.gender_healthcare_stem.auth.dto.LoginRequest;
import org.example.gender_healthcare_stem.auth.dto.LoginResponse;
import org.example.gender_healthcare_stem.auth.dto.RegisterRequest;
import org.example.gender_healthcare_stem.auth.dto.ResetPasswordRequest;
import org.example.gender_healthcare_stem.auth.model.Customer;
import org.example.gender_healthcare_stem.auth.model.PasswordResetToken;
import org.example.gender_healthcare_stem.auth.model.User;
import org.example.gender_healthcare_stem.auth.repository.CustomerRepository;
import org.example.gender_healthcare_stem.auth.repository.PasswordResetTokenRepository;
import org.example.gender_healthcare_stem.auth.repository.UserRepository;
import org.example.gender_healthcare_stem.auth.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /* -------------------------------------------------- */
    /*  1. Đăng ký                                        */
    /* -------------------------------------------------- */
    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return "Email already exists";
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role("customer")
                .status("active")
                .avatar(req.getAvatar())
                .createdAt(LocalDateTime.now())
                // .createdAt(...)  ➜ có thể bỏ, Hibernate tự set
                .build();

        userRepository.save(user);
        createCustomerIfAbsent(user);

        return "User registered successfully";
    }

    /* -------------------------------------------------- */
    /*  2. Đăng nhập (email + password)                   */
    /* -------------------------------------------------- */
    public LoginResponse login(LoginRequest req) {
        return userRepository.findByEmail(req.getEmail())
                .filter(u -> passwordEncoder.matches(req.getPassword(), u.getPasswordHash()))
                .map(u -> {
                    createCustomerIfAbsent(u);

                    String jwt = jwtService.generate(u.getId());
                    return new LoginResponse(u.getId(), u.getRole(), jwt);
                })
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }

    /* -------------------------------------------------- */
    /*  3. Đăng nhập Google OAuth                         */
    /* -------------------------------------------------- */
    public LoginResponse  handleGoogleLogin(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(
                            "866435222285-ifhi75knei1ai0450jlph4ui9s2slmu4.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null){
                System.out.println("Invalid ID token.");
                return null;
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name  = (String) payload.get("name");
            String avatarUrl = (String) payload.get("picture");

            // find or create user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newU = User.builder()
                        .email(email)
                        .fullName(name)
                        .avatar(avatarUrl)
                        .role("customer")
                        .status("active")
                        .passwordHash("")                // no local password
                        .createdAt(LocalDateTime.now())
                        .build();
                return userRepository.save(newU);
            });

            createCustomerIfAbsent(user);
            String jwt = jwtService.generate(user.getId());
            return new LoginResponse(user.getId(), user.getRole(), jwt);

        } catch (Exception e) {
            System.out.println("Google Login failed: " + e.getMessage());
            return null;
        }
    }

    /* -------------------------------------------------- */
    /*  4. Forgot / Reset password                        */
    /* -------------------------------------------------- */
    public String sendResetLink(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return "Email không tồn tại.";

        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1);

        tokenRepository.save(PasswordResetToken.builder()
                .token(token)
                .email(email)
                .expiryDate(expiry)
                .build());

        String link = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendResetEmail(email, link);
        return "Đã gửi link đặt lại mật khẩu tới email.";
    }

    public String resetPassword(ResetPasswordRequest req) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(req.getToken());
        if (tokenOpt.isEmpty()) return "Token không hợp lệ.";

        PasswordResetToken token = tokenOpt.get();
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) return "Token đã hết hạn.";

        User user = userRepository.findByEmail(token.getEmail())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại."));

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        tokenRepository.delete(token);
        return "Đổi mật khẩu thành công.";
    }

    /* -------------------------------------------------- */
    /*  Helper: tạo Customer nếu chưa có                 */
    /* -------------------------------------------------- */
    private void createCustomerIfAbsent(User user) {
        if (!"customer".equalsIgnoreCase(user.getRole())) return;  // chỉ áp dụng cho customer
        if (customerRepository.existsById(user.getId())) return;

        Customer c = Customer.builder().user(user).build();
        customerRepository.save(c);
    }
}
