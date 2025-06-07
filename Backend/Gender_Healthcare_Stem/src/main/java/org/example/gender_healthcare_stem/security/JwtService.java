package org.example.gender_healthcare_stem.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final long   EXP_MS = 1000 * 60 * 60 * 24;      // 24h
    private static final String SECRET = "s3cretKey123456789012345678901234567890"; // ≥32 ký tự
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    /** Sinh token, subject = userId */
    public String generate(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXP_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Lấy userId từ token (null nếu lỗi) */
    public Long extractUserId(String token) {
        try {
            String sub = Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token).getBody().getSubject();
            return Long.valueOf(sub);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    /** Kiểm tra hợp lệ & chưa hết hạn */
    public boolean isValid(String token) {
        return extractUserId(token) != null;
    }
}
