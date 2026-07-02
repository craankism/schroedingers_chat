package sc.backend.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.services.ChatMessageService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/messages")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @GetMapping("{roomId}")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable int roomId) {
        return new ResponseEntity<>(chatMessageService.getAllMessages(roomId), HttpStatus.OK);
    }

    @DeleteMapping("{messageId}")
    public ResponseEntity<?> deleteMessages(@PathVariable int messageId, Principal principal) {
        chatMessageService.deleteMessage(messageId, principal.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
