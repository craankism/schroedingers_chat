package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.services.AdminService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/invite")
    public ResponseEntity<RegistrationDTO> registerUserKey(@RequestBody RegisterUserKeyDTO registerUserKeyDTO, Authentication authentication) {
        return new ResponseEntity<>(adminService.registerUserKey(registerUserKeyDTO, authentication.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/user/setAdmin/{userId}")
    public ResponseEntity<UserDTO> setAdmin(@PathVariable int userId) {
        return new ResponseEntity<>(adminService.setAdmin(userId), HttpStatus.OK);
    }

    @GetMapping("/user/setTrainer/{userId}")
    public ResponseEntity<UserDTO> setTrainer(@PathVariable int userId) {
        return new ResponseEntity<>(adminService.setTrainer(userId), HttpStatus.OK);
    }

    @GetMapping("/user/setActive/{userId}")
    public ResponseEntity<UserDTO> setActive(@PathVariable int userId) {
        return new ResponseEntity<>(adminService.setActive(userId), HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        adminService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
