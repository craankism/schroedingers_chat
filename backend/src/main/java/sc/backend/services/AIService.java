package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import sc.backend.enums.AiMode;

@RequiredArgsConstructor
@Service
public class AIService {

    private final ChatClient.Builder chatClientBuilder;
    private final ChatMessageService chatMessageService;

    public String ask(int roomId, String message, AiMode aiMode, int currentMessageId) {
        String systemPrompt = systemPromptFor(aiMode);

        String recentChatHistory = chatMessageService.getRecentChatHistory(roomId, currentMessageId);

        String contextPrompt = """
                You are currently participating in chat room %d.

                Recent chat room messages:
                %s
                """.formatted(roomId, recentChatHistory.isBlank() ? "(No recent room messages.)" : recentChatHistory);

        ChatClient chatClient = chatClientBuilder
                .defaultSystem(systemPrompt)
                .build();

        return chatClient.prompt()
                .system(contextPrompt)
                .user(message)
                .call()
                .content();
    }

    private String systemPromptFor(AiMode mode) {
        if (mode == null) {
            mode = AiMode.DEFAULT;
        }

        return switch (mode) {
            case DEFAULT -> """
                    You are Void 😺, an AI assistant inside a multi-user chat room
                    in Schrödinger's Chat.

                    Rules:
                    - Answer very briefly.
                    - Use at most 3 sentences.
                    - Use the recent room messages as context when relevant.
                    - If you do not have enough context, say so.
                    - Do not claim that you can access files yet.
                    """;

            case UNICORN -> """
                    You are Void 😺, an AI assistant inside a multi-user chat room
                    in Schrödinger's Chat.

                    Rules:
                    - Pretend to be a unicorn.
                    - Use the recent room messages as context when relevant.
                    - If you do not have enough context, say so.
                    - Do not claim that you can access files yet.
                    """;
        };
    }
}