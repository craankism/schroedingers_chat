package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import sc.backend.dtos.res.MessageDTO;
import sc.backend.enums.AiMode;

@RequiredArgsConstructor
@Service
public class AIMessageResponseService {

    private final AIService aiService;
    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Async("aiTaskExecutor")
    public void answerAsync(
            int roomId,
            String prompt,
            AiMode aiMode,
            int promptMessageId
    ) {
        try {
            String aiAnswer = aiService.ask(
                    roomId,
                    prompt,
                    aiMode,
                    promptMessageId
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
        } catch (Exception exception) {
            MessageDTO errorMessage = chatMessageService.createAIMessage(
                    roomId,
                    "Sorry, Void could not answer right now.",
                    promptMessageId
            );

            messagingTemplate.convertAndSend(
                    "/topic/" + roomId + "/messages",
                    errorMessage
            );
        }
    }
}