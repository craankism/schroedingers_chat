package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    @PostMapping("/register/{code}")
    public ResponseEntity<AuthDTO> register(@PathVariable String code, @RequestBody RegisterDTO registerDTO) {
        return new ResponseEntity<>(authService.register(code, registerDTO), HttpStatus.CREATED);
    }

    @GetMapping("/register/validation/{code}")
    public ResponseEntity<CodeDTO> checkValidity(@PathVariable String code) {
        return new ResponseEntity<>(authService.checkValidity(code), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        AuthDTO authDTO;

        try {
            authDTO = authService.login(loginDTO);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(authDTO, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public AuthDTO refresh(@RequestBody RefreshRequestDTO request) {
        return authService.refresh(request.getRefreshToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshRequestDTO request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

}
