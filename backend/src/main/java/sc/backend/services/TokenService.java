package sc.backend.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sc.backend.entities.User;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class TokenService {

    @Value("${jwt.token.secret}")
    private String jwtSecret;

    @Value("${jwt.token.prefix}")
    private String jwtPrefix;

    public String generateTokenWithClaims(User user) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("email", user.getEmail());
        claims.put("displayName", user.getDisplayName());
        claims.put("isAdmin", user.isAdmin());
        claims.put("isTrainer", user.isTrainer());

        return generateToken(claims, user);
    }

    public String generateToken(Map<String, Object> claims, User user) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(user.getUserId()))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
