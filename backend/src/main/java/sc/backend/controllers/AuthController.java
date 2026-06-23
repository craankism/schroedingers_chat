package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.LoginDTO;
import sc.backend.dtos.req.RegisterDTO;
import sc.backend.dtos.res.AuthDTO;
import sc.backend.services.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final UserService userService;

    @PostMapping("register/{code}")
    public ResponseEntity<?> register(@PathVariable String code, @RequestBody RegisterDTO registerDTO) {
        return new ResponseEntity<>(userService.register(code, registerDTO), HttpStatus.OK);
    }

    @GetMapping("registration-codes/{code}/validity")
    public ResponseEntity<?> checkValidity(@PathVariable("code") String code) {
        return new ResponseEntity<>(userService.checkValidity(code), HttpStatus.OK);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        AuthDTO authDTO;

        try {
            authDTO = userService.login(loginDTO);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(authDTO, HttpStatus.OK);
    }

}
