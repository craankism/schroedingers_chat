package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.EditRoomDTO;
import sc.backend.dtos.req.CreateRoomDTO;
import sc.backend.dtos.res.RoomDTO;
import sc.backend.services.RoomService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/room")
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@RequestBody CreateRoomDTO createRoomDTO, Principal principal) {
        return new ResponseEntity<>(roomService.createRoom(createRoomDTO, principal.getName()), HttpStatus.CREATED);
    }

    @GetMapping("{roomId}")
    public ResponseEntity<RoomDTO> getRoom(@PathVariable int roomId) {
        return new ResponseEntity<>(roomService.getRoom(roomId), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return new ResponseEntity<>(roomService.getAllRooms(), HttpStatus.OK);
    }

    @PutMapping("{roomId}")
    public ResponseEntity<RoomDTO> editRoom(@PathVariable int roomId, @RequestBody EditRoomDTO addUserToRoomDTO) {
        return new ResponseEntity<>(roomService.editRoom(roomId, addUserToRoomDTO), HttpStatus.OK);
    }

    @DeleteMapping("{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable int roomId) {
        roomService.deleteRoom(roomId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
