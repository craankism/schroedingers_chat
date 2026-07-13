package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.EditUserDTO;
import sc.backend.dtos.res.UserDTO;
import sc.backend.services.UserService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;
    private final WebSocketController webSocketController;

    private void broadcastUserUpdate(int userId) {
        webSocketController.broadcastUpdate("USER_UPDATE", userId);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("check")
    public ResponseEntity<UserDTO> getCurrentUser(Principal principal) {
        return new ResponseEntity<>(userService.getCurrentUser(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable int userId) {
        return new ResponseEntity<>(userService.getUser(userId), HttpStatus.OK);
    }

    @PutMapping("{userId}")
    public ResponseEntity<UserDTO> editUser(@PathVariable int userId, @RequestBody EditUserDTO editUserDTO,
            Principal principal) {
        UserDTO user = userService.editUser(userId, editUserDTO, principal.getName());
        broadcastUserUpdate(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId, Principal principal) {
        userService.deleteUser(userId, principal.getName());
        broadcastUserUpdate(0);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
