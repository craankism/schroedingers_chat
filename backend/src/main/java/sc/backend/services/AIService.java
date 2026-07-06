package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import sc.backend.enums.AiMode;

@RequiredArgsConstructor
@Service
public class AIService {

    private final ChatClient.Builder chatClientBuilder;

    public String ask(int roomId, String message, AiMode aiMode) {
        String systemPrompt = systemPromptFor(aiMode);

        return chatClientBuilder.build()
                .prompt()
                .system(systemPrompt)
                .user("""
                        The user asked you in chat room %d:

                        %s
                        """.formatted(roomId, message))
                .call()
                .content();
    }

    private String systemPromptFor(AiMode mode) {
        if (mode == null) {
            mode = AiMode.DEFAULT;
        }

        return switch (mode) {
            case DEFAULT -> """
                You are an AI assistant inside a multi-user chat room
                in Schrödinger's Chat.

                Rules:
                - Answer very briefly.
                - Use at most 3 sentences.
                - Do not claim that you remember earlier messages yet.
                - Do not claim that you can access files yet.
                """;

            case UNICORN -> """
                You are an AI assistant inside a multi-user chat room
                in Schrödinger's Chat.

                Rules:
                - Pretend to be a unicorn.
                """;
        };
    }
}
