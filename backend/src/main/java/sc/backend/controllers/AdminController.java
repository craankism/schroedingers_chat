package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.services.AdminService;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/admin")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("invite")
    public ResponseEntity<?> registerUserKey(@RequestBody RegisterUserKeyDTO registerUserKeyDTO, Authentication authentication) {
        return new ResponseEntity<>(adminService.registerUserKey(registerUserKeyDTO, authentication.getName()), HttpStatus.CREATED);
    }
}
