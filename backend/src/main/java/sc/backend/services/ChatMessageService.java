package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.repositories.ChatMessageRepository;
import sc.backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final UserService userService;

    @Transactional
    public MessageDTO createMessage(int roomId, SendMessageDTO request, String authenticatedEmail) {
        User creator = userService.getUserByEmail(userRepository.findByEmail(authenticatedEmail));
        Room room = roomService.findRoomById(roomId);

        ChatMessage chatMessage = ChatMessage.builder()
                .content(request.getContent())
                .creationDate(LocalDateTime.now())
                .createdBy(creator)
                .room(room)
                .build();

        chatMessageRepository.save(chatMessage);

        return convertToDTO(chatMessage);
    }

    public List<MessageDTO> getAllMessages(int roomId) {
        Room room = roomService.findRoomById(roomId);
        List<MessageDTO> messageDTOList = new ArrayList<>();

        for (ChatMessage chatMessage : chatMessageRepository.findAllByRoom(room)) {
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