package sc.backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.enums.AiMode;
import sc.backend.exceptions.AIException;

@Slf4j
@ConditionalOnProperty(
        name = "ai.enabled",
        havingValue = "true",
        matchIfMissing = false
)
@Profile("prod")
@RequiredArgsConstructor
@Service
public class AIMessageResponseService {

    private final AIService aiService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final OllamaAvailabilityService ollamaAvailabilityService;

    @Async("aiTaskExecutor")
    public void answerAsync(
            int roomId,
            String prompt,
            AiMode aiMode,
            int promptMessageId,
            Integer fileId
    ) {
        try {
            if (!ollamaAvailabilityService.isAvailable()) {
                MessageDTO errorMessage =
                        chatMessageService.createAIMessage(
                                roomId,
                                "Void cannot reach the quantum realm right now. "
                                        + "*taps the empty food bowl* "
                                        + "Ollama appears to be unavailable.",
                                promptMessageId
                        );

                messagingTemplate.convertAndSend(
                        "/topic/" + roomId + "/messages",
                        errorMessage
                );

                return;
            }

            String aiAnswer = aiService.ask(
                    roomId,
                    prompt,
                    aiMode,
                    promptMessageId,
                    fileId
            );

            MessageDTO aiMessageDTO = chatMessageService.createAIMessage(
                    roomId,
                    aiAnswer,
                    promptMessageId
            );

            messagingTemplate.convertAndSend(
                    "/topic/" + roomId + "/messages",
                    aiMessageDTO
            );
        } catch (AIException e) {
            log.error("AI request failed for room {}: {}", roomId, e.getMessage(), e);

            String userMessage = determineErrorMessage(e);

            MessageDTO errorMessage = chatMessageService.createAIMessage(
                    roomId,
                    userMessage,
                    promptMessageId
            );

            messagingTemplate.convertAndSend(
                    "/topic/" + roomId + "/messages",
                    errorMessage
            );
        } catch (Exception e) {
            log.error("Unexpected error in AI response for room {}: {}", roomId, e.getMessage(), e);

            MessageDTO errorMessage = chatMessageService.createAIMessage(
                    roomId,
                    "Sorry, Void could not answer right now due to an unexpected error.",
                    promptMessageId
            );

            messagingTemplate.convertAndSend(
                    "/topic/" + roomId + "/messages",
                    errorMessage
            );
        }
    }

    private String determineErrorMessage(AIException e) {
        String causeMsg = e.getCause() != null ? e.getCause().getClass().getSimpleName() : "";

        if (causeMsg.contains("Timeout")) {
            return "The black cat got stuck in a laser pointer chase... *blinks slowly* Try again in a moment, human.";
        }

        if (causeMsg.contains("RateLimit") || causeMsg.contains("TooManyRequests")) {
            return "*stretches lazily* Too many paws on the keyboard lately. Give Void some quiet time, then come back.";
        }

        if (causeMsg.contains("Connection") || causeMsg.contains("Network")) {
            return "The black cat is currently chasing signals in the void... *ears twitch* Connection problems. Try again later.";
        }

        return "*grooming paw* Sorry, Void got distracted by something shiny. Come back when I'm done napping.";
    }
}