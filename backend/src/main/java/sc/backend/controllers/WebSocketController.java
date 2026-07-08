package sc.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import sc.backend.dtos.req.DeleteMessageDTO;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.dtos.res.UpdateEventDTO;
import sc.backend.enums.AiMode;
import sc.backend.services.AIService;
import sc.backend.services.ChatMessageService;
import org.springframework.security.access.AccessDeniedException;

import java.security.Principal;

@RequiredArgsConstructor
@Controller
public class WebSocketController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final AIService aiService;

    public void broadcastUpdate(String updateType, int id) {
        messagingTemplate.convertAndSend("/topic/updates", new UpdateEventDTO(updateType, id));
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable int roomId, @Payload SendMessageDTO message, Principal principal) {
        if (principal == null) {
            throw new AccessDeniedException("Not authenticated");
        }

        MessageDTO messageDTO = chatMessageService.createMessage(roomId, message, principal.getName());

        messagingTemplate.convertAndSend("/topic/" + roomId + "/messages", messageDTO);

        if (aiMentioned(message.getContent())) {
            String prompt = removeAiMention(message.getContent());

            // TODO: can be adjusted later
            AiMode aiMode = message.getAiMode();
            String aiAnswer = aiService.ask(roomId, prompt, aiMode, messageDTO.getMessageId());

            MessageDTO aiMessageDTO = chatMessageService.createAIMessage(roomId, aiAnswer);

            messagingTemplate.convertAndSend("/topic/" + roomId + "/messages", aiMessageDTO);
        }
    }

    @MessageMapping("/chat/{roomId}/delete")
    @SendTo("/topic/{roomId}/delete")
    public DeleteMessageDTO deleteMessage(@Payload DeleteMessageDTO deleteMessageDTO, Principal principal,
            @DestinationVariable int roomId) {
        if (principal == null) {
            throw new AccessDeniedException("Not authenticated");
        }
        chatMessageService.deleteMessage(deleteMessageDTO.getMessageId(), principal.getName());
        broadcastUpdate("MESSAGE_UPDATE", roomId);
        return deleteMessageDTO;
    }

    private boolean aiMentioned(String text) {
        return text != null && text.matches("(?i).*@void.*");
    }

    private String removeAiMention(String text) {
        if (text == null) {
            return "";
        }

        return text.replaceAll("(?i)@void", "").trim();
    }

}
