package sc.backend.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RefreshRequestDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.dtos.res.CodeDTO;
import sc.backend.services.AuthService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final WebSocketController webSocketController;
    
    @GetMapping("/verify/{token}")
    public ResponseEntity<String> handleVerification(@PathVariable String token) {
        return new ResponseEntity<>(authService.verifyEmail(token), HttpStatus.OK);
    }

    private void broadcastAuthUpdate(int userId, boolean online) {
        webSocketController.broadcastUpdate("AUTH_UPDATE", userId, online);
    }

    private void broadcastUserUpdate(int userId) {
        webSocketController.broadcastUpdate("USER_UPDATE", userId);
    }

    @PostMapping("/register/{code}")
    public ResponseEntity<AuthDTO> register(@PathVariable String code, @RequestBody RegisterDTO registerDTO) {
        AuthDTO userAuthDTO = authService.register(code, registerDTO);
        broadcastUserUpdate(userAuthDTO.getUserId());
        return new ResponseEntity<>(userAuthDTO, HttpStatus.CREATED);
    }

    @GetMapping("/register/validation/{code}")
    public ResponseEntity<CodeDTO> checkValidity(@PathVariable String code) {
        return new ResponseEntity<>(authService.checkValidity(code), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        return new ResponseEntity<>(authService.login(loginDTO), HttpStatus.OK);
    }

    @PostMapping("/online/{userId}")
    public void onlineStatus(@PathVariable int userId, @RequestBody boolean status) {
        broadcastAuthUpdate(userId, status);
    }

    @PostMapping("/refresh")
    public AuthDTO refresh(@RequestBody RefreshRequestDTO request) {
        return authService.refresh(request.getRefreshToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshRequestDTO request) {
        int userId = authService.logout(request.getRefreshToken());
        broadcastAuthUpdate(userId, false);
        return ResponseEntity.noContent().build();
    }

}
