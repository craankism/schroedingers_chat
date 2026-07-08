package sc.backend.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.services.ChatMessageService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/messages")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    private final WebSocketController webSocketController;

    private void broadcastAuthUpdate(int userId, boolean online) {
        webSocketController.broadcastUpdate("AUTH_UPDATE", userId, online);
    }

    @GetMapping("{roomId}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable int roomId) {
        if (roomId > 0) {
            broadcastAuthUpdate(0, false);
        }
        return new ResponseEntity<>(chatMessageService.getAllMessages(roomId), HttpStatus.OK);
    }
}
