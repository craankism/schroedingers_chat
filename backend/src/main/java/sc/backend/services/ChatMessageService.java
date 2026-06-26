package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.User;
import sc.backend.repositories.ChatMessageRepository;
import sc.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageDTO createMessage(SendMessageDTO request, String authenticatedEmail) {
        User creator = userRepository.findByEmail(authenticatedEmail).orElseThrow(() ->
                        new EntityNotFoundException("Authenticated user not found"));

        ChatMessage chatMessage = ChatMessage.builder()
                .content(request.getContent())
                .creationDate(new Date(System.currentTimeMillis()))
                .createdBy(creator)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        return convertToDTO(savedMessage);
    }

    public List<MessageDTO> getAllMessages() {
        List<MessageDTO> messageDTOList = new ArrayList<>();

        for (ChatMessage chatMessage : chatMessageRepository.findAll()) {
            messageDTOList.add(convertToDTO(chatMessage));
        }

        return messageDTOList;
    }

    public MessageDTO convertToDTO(ChatMessage message) {
        return MessageDTO.builder()
                .messageId(message.getMessageId())
                .content(message.getContent())
                .sender(message.getCreatedBy().getDisplayName())
                .creationDate(message.getCreationDate())
                .build();
    }
}