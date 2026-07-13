package sc.backend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.entities.RefreshToken;
import sc.backend.entities.User;
import sc.backend.exceptions.AccountInactiveException;
import sc.backend.exceptions.TokenInvalidException;
import sc.backend.repositories.RefreshTokenRepository;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.token.secret}")
    private String jwtSecret;

    @Value("${jwt.token.prefix}")
    private String jwtPrefix;

    @Value("${jwt.access-token.expiration-minutes:15}")
    private int accessTokenExpirationMinutes;

    @Value("${jwt.refresh-token.expiration-days:7}")
    private int refreshTokenExpirationDays;


    public String generateTokenWithClaims(User user) {
        Map<String, Object> claims = new HashMap<>();

        //TODO: what should be in the token?
        claims.put("userId", user.getUserId());
        claims.put("email", user.getEmail());
        claims.put("displayName", user.getDisplayName());
        claims.put("isAdmin", user.isAdmin());
        claims.put("isTrainer", user.isTrainer());

        return generateToken(claims, user);
    }

    public String generateToken(Map<String, Object> claims, User user) {
        int expirationMs = accessTokenExpirationMinutes * 60 * 1000;
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSignInKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiredAt(token).before(new Date(System.currentTimeMillis()));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiredAt(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    @Transactional
    public String generateRefreshToken(User user) {
        String rawToken = generateSecureRandomToken();
        String hash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(LocalDateTime.now().plusDays(refreshTokenExpirationDays))
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Transactional
    public RefreshToken validateRefreshToken(String rawToken) {
        String hash = hashToken(rawToken);
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash).orElse(null);

        if(token == null || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenInvalidException("Refresh Token invalid or expired.");
        }

        if(!token.getUser().isActive()) {
            refreshTokenRepository.delete(token);
            throw new AccountInactiveException("User is deactivated");
        }

        return token;
    }

    @Transactional
    public String rotateRefreshToken(String rawToken) {
        RefreshToken oldToken = validateRefreshToken(rawToken);
        User user = oldToken.getUser();
        refreshTokenRepository.delete(oldToken);
        return generateRefreshToken(user);
    }

    @Transactional
    public void deleteRefreshToken(String rawToken) {
        String hash = hashToken(rawToken);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(refreshTokenRepository::delete);
    }

    private String generateSecureRandomToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
