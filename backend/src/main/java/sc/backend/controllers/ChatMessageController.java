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

    @GetMapping("{roomId}/{index}")
    public ResponseEntity<List<MessageDTO>> getFiftyMessages(@PathVariable int roomId, @PathVariable int index,
            Principal principal) {
        return new ResponseEntity<>(chatMessageService.getFiftyMessages(roomId, index, principal.getName()),
                HttpStatus.OK);
    }
}
