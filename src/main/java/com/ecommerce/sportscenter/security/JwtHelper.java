package com.ecommerce.sportscenter.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.function.Function;

public class JwtHelper {
    private static final long JWT_TOKEN_VALIDITY_SECONDS = 5 * 60 * 60L;

    @Value("${jwt.key}")
    private String secretKey;

    public String getUserNameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) { // Functional interface Function<Input, Output>
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        Key hmacKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return Jwts.parserBuilder()
                .setSigningKey(hmacKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
