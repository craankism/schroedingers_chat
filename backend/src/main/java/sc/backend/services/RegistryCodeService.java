package sc.backend.services;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistryCodeService {

    private final SecureRandom random = new SecureRandom();
    private List<String> wordList;

    @PostConstruct
    public void init() throws IOException {
        loadWordList();
    }

    private void loadWordList() throws IOException {
        ClassPathResource resource = new ClassPathResource("registrationWordList.txt");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream()))) {
            this.wordList = reader.lines()
                    .map(String::trim)
                    .filter(line -> !line.isEmpty())
                    .collect(Collectors.toList());
            if (wordList.size() < 200) {
                throw new IllegalStateException("Not enough Words in wordlist.txt! At least 200 needed.");
            }
        }
    }

    public String generateRegistryCode() {
        if (wordList == null || wordList.isEmpty()) {
            throw new IllegalStateException("WordList not loaded!");
        }
        System.out.println(wordList);
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 4; i++) {
            String word = wordList.get(random.nextInt(wordList.size()));
            if (i>0) code.append("-");
            code.append(word);
        }
        System.out.println(code);
        return code.toString();
    }
}
