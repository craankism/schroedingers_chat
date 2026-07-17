package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import sc.backend.components.CryptoUtil;
import sc.backend.entities.SmtpConfig;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.repositories.SmtpConfigRepository;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Properties;

@RequiredArgsConstructor
@Service
public class DynamicMailSenderService {

    private final SmtpConfigRepository smtpConfigRepository;
    private final CryptoUtil cryptoUtil;

    public boolean isSmtpConfirmed() {
        return smtpConfigRepository.findById(1)
                .map(SmtpConfig::isConfigConfirmed)
                .orElse(false);
    }

    public String getSenderAddress() {
        SmtpConfig config = getConfig();
        return config.getSender();
    }

    public JavaMailSender getMailSender() {
        SmtpConfig config = getConfig();
        if (!config.isConfigConfirmed()) {
            throw new IllegalStateException("SMTP configuration is not confirmed");
        }
        return buildMailSender(config);
    }

    public JavaMailSender buildMailSender(SmtpConfig config) {
        byte[] decryptedPassword = cryptoUtil.decrypt(
                Base64.getDecoder().decode(config.getPasswordEncrypted()),
                Base64.getDecoder().decode(config.getPasswordIv())
        );

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(config.getHost());
        mailSender.setPort(config.getPort());
        mailSender.setUsername(config.getUsername());
        mailSender.setPassword(new String(decryptedPassword, StandardCharsets.UTF_8));

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", String.valueOf(config.isTlsEnabled()));
        props.put("mail.debug", "false");

        return mailSender;
    }

    private SmtpConfig getConfig() {
        return smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Configuration not found"));
    }
}