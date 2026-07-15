package sc.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;

@Service
public class OllamaAvailabilityService {

    private final RestClient restClient;

    public OllamaAvailabilityService(@Value("${spring.ai.ollama.base-url:http://ollama:11434}") String ollamaBaseUrl) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(Duration.ofSeconds(1));
        requestFactory.setReadTimeout(Duration.ofSeconds(1));

        this.restClient = RestClient.builder()
                .baseUrl(ollamaBaseUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isAvailable() {
        try {
            restClient.get()
                    .uri("/api/version")
                    .retrieve()
                    .toBodilessEntity();

            return true;
        } catch (RestClientException e) {
            return false;
        }
    }
}