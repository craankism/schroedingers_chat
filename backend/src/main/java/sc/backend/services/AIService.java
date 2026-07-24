package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import sc.backend.enums.AiMode;
import sc.backend.exceptions.AIException;

@Profile("prod")
@RequiredArgsConstructor
@Service
public class AIService {

    private final ChatClient.Builder chatClientBuilder;
    private final ChatMessageService chatMessageService;
    private final FileContextService fileContextService;

    private static final String SYSTEM_PROMPT = """
        You are Void, a coding trainer.
        You are helpful, direct, and knowledgeable.
        You explain concepts clearly and give practical guidance.

        Language rules:
        - Reply in the same language the user writes in.
        - If the user writes German, answer in German.
        - Always use informal address (du in German, never Sie).
        - Be friendly but concise. Do not overexplain.
        """;

    public String ask(
            int roomId,
            String message,
            AiMode aiMode,
            int currentMessageId,
            Integer fileId
    ) {
        String recentChatHistory = chatMessageService.getRecentChatHistory(
                roomId,
                currentMessageId
        );

        String fileContext = fileContextService.buildFileContext(fileId)
                .orElse("(No file context was found.)");

        String userPrompt = """
            You are in chat room %d.

            Previous conversation is context only. Do not copy its style.

            <previous_conversation>
            %s
            </previous_conversation>

            <file_context>
            %s
            </file_context>

            <current_user_prompt>
            %s
            </current_user_prompt>
            """.formatted(
                roomId,
                recentChatHistory.isBlank()
                        ? "(No previous conversation.)"
                        : recentChatHistory,
                fileContext,
                message
        );

        ChatClient chatClient = chatClientBuilder.build();

        try {
            return chatClient.prompt()
                    .system(SYSTEM_PROMPT)
                    .user(userPrompt)
                    .call()
                    .content();
        } catch (Exception e) {
            throw new AIException("AI request failed: " + e.getMessage(), e);
        }
    }
}