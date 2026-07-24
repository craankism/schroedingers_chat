package sc.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.components.CryptoUtil;
import sc.backend.dtos.req.SendMessageDTO;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.entities.ChatMessage;
import sc.backend.entities.Room;
import sc.backend.entities.User;
import sc.backend.exceptions.PermissionException;
import sc.backend.repositories.ChatMessageRepository;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final RoomService roomService;
    private final UserService userService;
    private final CryptoUtil cryptoUtil;

    @Transactional
    public MessageDTO createMessage(int roomId, SendMessageDTO request, String authenticatedEmail) {
        User sender = userService.findUserByEmail(authenticatedEmail);
        Room room = roomService.findRoomById(roomId);

        checkRoomMembership(room, sender);

        String plaintext = request.getContent();

        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(plaintext.getBytes(StandardCharsets.UTF_8));
        String ciphertextBase64 = Base64.getEncoder().encodeToString(result.ciphertext());

        ChatMessage chatMessage = ChatMessage.builder()
                .content(ciphertextBase64)
                .iv(result.iv())
                .creationDate(LocalDateTime.now())
                .senderType("USER")
                .aiPrompt(false)
                .aiPromptMessageId(null)
                .build();

        sender.addChatMessage(chatMessage);
        room.addChatMessage(chatMessage);
        chatMessageRepository.save(chatMessage);

        return convertToDTO(chatMessage);
    }

    @Transactional
    public MessageDTO createAIMessage(int roomId, String plaintext, Integer aiPromptMessageId) {
        Room room = roomService.findRoomById(roomId);

        CryptoUtil.EncryptionResult result = cryptoUtil.encrypt(plaintext.getBytes(StandardCharsets.UTF_8));
        String ciphertextBase64 = Base64.getEncoder().encodeToString(result.ciphertext());

        ChatMessage chatMessage = ChatMessage.builder()
                .content(ciphertextBase64)
                .iv(result.iv())
                .creationDate(LocalDateTime.now())
                .senderType("AI")
                .room(room)
                .createdBy(null)
                .aiPrompt(false)
                .aiPromptMessageId(aiPromptMessageId)
                .build();

        room.addChatMessage(chatMessage);
        chatMessageRepository.save(chatMessage);

        return convertToDTO(chatMessage);
    }

    public List<MessageDTO> getFiftyMessages(int roomId, int index, String authenticatedEmail) {
        User user = userService.findUserByEmail(authenticatedEmail);
        Room room = roomService.findRoomById(roomId);

        checkRoomMembership(room, user);

        List<MessageDTO> messageDTOList = new ArrayList<>();

        for (ChatMessage chatMessage : chatMessageRepository.findAllByRoom(room, index * 50)) {
            messageDTOList.add(convertToDTO(chatMessage));
        }

        return messageDTOList;
    }

    @Transactional
    public void deleteMessage(int messageId, String authenticatedEmail) {
        User authenticatedUser = userService.findUserByEmail(authenticatedEmail);

        ChatMessage chatMessage = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message with id " + messageId + " not found"));

        User user = chatMessage.getCreatedBy();

        if (user == null) {
            if (!authenticatedUser.isAdmin()) {
                throw new PermissionException("Only admins can delete AI messages");
            }
        } else if (authenticatedUser.getUserId() != user.getUserId() && !authenticatedUser.isAdmin()) {
            throw new PermissionException("You are not allowed to delete this message");
        }

        // Don't delete Message, just set content to null
        chatMessage.setContent(null);
        chatMessageRepository.save(chatMessage);
    }

    public String getRecentChatHistory(int roomId, int currentMessageId) {
        List<ChatMessage> prompts = chatMessageRepository.findRecentAiPrompts(roomId, currentMessageId);

        if (prompts.isEmpty()) {
            return "";
        }

        List<Integer> promptIds = prompts.stream()
                .map(ChatMessage::getMessageId)
                .toList();

        List<ChatMessage> aiAnswers = chatMessageRepository.findAiAnswersForPrompts(roomId, promptIds);

        Map<Integer, ChatMessage> answerByPromptId = aiAnswers.stream()
                .filter(answer -> answer.getAiPromptMessageId() != null)
                .collect(Collectors.toMap(
                        ChatMessage::getAiPromptMessageId,
                        answer -> answer,
                        (first, second) -> first));

        Collections.reverse(prompts);

        StringBuilder transcript = new StringBuilder();

        for (ChatMessage prompt : prompts) {
            String promptContent = cleanForPrompt(decryptContent(prompt));

            if (promptContent.isBlank()) {
                continue;
            }

            transcript.append("User: ")
                    .append(promptContent)
                    .append("\n");

            ChatMessage aiAnswer = answerByPromptId.get(prompt.getMessageId());

            if (aiAnswer != null) {
                String answerContent = cleanForPrompt(decryptContent(aiAnswer));

                if (!answerContent.isBlank()) {
                    transcript.append("Void: ")
                            .append(answerContent)
                            .append("\n");
                }
            }

            transcript.append("\n---\n");
        }

        return transcript.toString();
    }

    private String cleanForPrompt(String content) {
        if (content == null) {
            return "";
        }

        return content
                .replaceAll("\\s+", " ")
                .trim();
    }

    @Transactional
    public void markAsAiPrompt(int messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message with id " + messageId + " not found"));

        message.setAiPrompt(true);
        chatMessageRepository.save(message);
    }

    private void checkRoomMembership(Room room, User user) {
        if (room.getUserSet().stream().noneMatch(u -> u.getUserId() == user.getUserId())) {
            throw new PermissionException("You are not a Member of this Room");
        }
    }

    private MessageDTO convertToDTO(ChatMessage message) {
        String sender;

        if ("AI".equalsIgnoreCase(String.valueOf(message.getSenderType())) && message.getCreatedBy() == null) {
            sender = "Void";
        } else if("USER".equalsIgnoreCase(String.valueOf(message.getSenderType())) && message.getCreatedBy() == null) {
            sender = "Deleted User";
        } else {
            sender = message.getCreatedBy().getDisplayName();
        }

        return MessageDTO.builder()
                .messageId(message.getMessageId())
                .userId(message.getCreatedBy() != null ? message.getCreatedBy().getUserId() : null)
                .content(decryptContent(message))
                .sender(sender)
                .creationDate(message.getCreationDate())
                .promptMessageId(message.getAiPromptMessageId())
                .build();
    }

    private String decryptContent(ChatMessage message) {
        if (message.getContent() == null) {
            return null;
        }
        byte[] ciphertext = Base64.getDecoder().decode(message.getContent());
        byte[] plaintextBytes = cryptoUtil.decrypt(ciphertext, message.getIv());
        return new String(plaintextBytes, StandardCharsets.UTF_8);
    }
}