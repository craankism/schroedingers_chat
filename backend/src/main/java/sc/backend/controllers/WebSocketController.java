package sc.backend.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;

@Controller
public class WebSocketController {

//    @MessageMapping("/chat")
//    @SendTo("/topic/messages")
//    public MessageDTO sendMessage(@Payload SendMessageDTO sendMessageDTO) {
//        return MessageDTO.builder()
//                .content(sendMessageDTO.getContent())
//                .sender(sendMessageDTO.getSender())
//                .build();
//    }
@MessageMapping("/chat")
@SendTo("/topic/messages")
public String sendMessage(@Payload String message) {
    return message;
}
}
