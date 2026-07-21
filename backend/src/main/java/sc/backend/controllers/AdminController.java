package sc.backend.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.RegisterUserKeyDTO;
import sc.backend.dtos.res.RegistrationDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.services.AdminService;

@Tag(name = "Administration", description = "Admin-only user management and invitation endpoints")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final WebSocketController webSocketController;

    private void broadcastUserUpdate(int userId) {
        webSocketController.broadcastUpdate("USER_UPDATE", userId);
    }

    @PostMapping("/invite")
    public ResponseEntity<RegistrationDTO> registerUserKey(@RequestBody RegisterUserKeyDTO registerUserKeyDTO,
            Authentication authentication) {
        return new ResponseEntity<>(adminService.registerUserKey(registerUserKeyDTO, authentication.getName()),
                HttpStatus.CREATED);
    }

    @PutMapping("/user/setAdmin/{userId}")
    public ResponseEntity<UserDTO> setAdmin(@PathVariable int userId) {
        UserDTO userDTO = adminService.setAdmin(userId);
        broadcastUserUpdate(userId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/user/setTrainer/{userId}")
    public ResponseEntity<UserDTO> setTrainer(@PathVariable int userId) {
        UserDTO userDTO = adminService.setTrainer(userId);
        broadcastUserUpdate(userId);
        webSocketController.broadcastUpdate("ROOM_UPDATE", 0);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @PutMapping("/user/setActive/{userId}")
    public ResponseEntity<UserDTO> setActive(@PathVariable int userId) {
        broadcastUserUpdate(userId);
        return new ResponseEntity<>(adminService.setActive(userId), HttpStatus.OK);
    }
}
