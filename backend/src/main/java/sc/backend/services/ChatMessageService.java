package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.components.CryptoUtil;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.repositories.ChatMessageRepository;
import sc.backend.repositories.UserRepository;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final UserService userService;
    private final CryptoUtil cryptoUtil;

    @Transactional
    public MessageDTO createMessage(int roomId, SendMessageDTO request, String authenticatedEmail) {
        User creator = userService.getUserByEmail(userRepository.findByEmail(authenticatedEmail));
        Room room = roomService.findRoomById(roomId);

        String plaintext = request.getContent();

        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(plaintext.getBytes(StandardCharsets.UTF_8));
        String ciphertextBase64 = Base64.getEncoder().encodeToString(result.ciphertext());

        ChatMessage chatMessage = ChatMessage.builder()
                .content(ciphertextBase64)
                .iv(result.iv())
                .creationDate(LocalDateTime.now())
                .build();

        creator.addChatMessage(chatMessage);
        room.addChatMessage(chatMessage);
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

    private MessageDTO convertToDTO(ChatMessage message) {
        return MessageDTO.builder()
                .messageId(message.getMessageId())
                .content(decryptContent(message))
                .sender(message.getCreatedBy().getDisplayName())
                .creationDate(message.getCreationDate())
                .build();
    }

    private String decryptContent(ChatMessage message) {
        byte[] ciphertext = Base64.getDecoder().decode(message.getContent());
        byte[] plaintextBytes = cryptoUtil.decrypt(ciphertext, message.getIv());
        return new String(plaintextBytes, StandardCharsets.UTF_8);
    }
}