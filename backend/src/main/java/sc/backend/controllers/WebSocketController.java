package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import sc.backend.dtos.req.DeleteMessageDTO;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.services.ChatMessageService;
import org.springframework.security.access.AccessDeniedException;

import java.security.Principal;

@RequiredArgsConstructor
@Controller
public class WebSocketController {

    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/{roomId}/messages")
    public MessageDTO sendMessage(@DestinationVariable int roomId, @Payload SendMessageDTO message,
            Principal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Not authenticated");
        }

        return chatMessageService.createMessage(roomId, message, principal.getName());
    }

    @MessageMapping("/chat/{roomId}/delete")
    @SendTo("/topic/{roomId}/delete")
    public DeleteMessageDTO deleteMessage(@DestinationVariable int roomId, @Payload DeleteMessageDTO deleteMessageDTO,
            Principal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Not authenticated");
        }

        chatMessageService.deleteMessage(deleteMessageDTO.getMessageId());
        return deleteMessageDTO;
    }
}
