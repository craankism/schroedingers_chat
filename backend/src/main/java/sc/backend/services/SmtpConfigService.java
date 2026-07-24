package sc.backend.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.components.CryptoUtil;
import sc.backend.dtos.req.SmtpConfigDTO;
import sc.backend.dtos.req.SmtpConfirmedDTO;
import sc.backend.dtos.req.SmtpTestDTO;
import sc.backend.dtos.res.SmtpDTO;
import sc.backend.entities.SmtpConfig;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.exceptions.SmtpConfigurationException;
import sc.backend.repositories.SmtpConfigRepository;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class SmtpConfigService {

    private final SmtpConfigRepository smtpConfigRepository;
    private final CryptoUtil cryptoUtil;
    private final DynamicMailSenderService dynamicMailSenderService;

    public SmtpDTO createSmtpConfig(SmtpConfigDTO smtpConfigDTO) {
        validateSmtpConfigDTO(smtpConfigDTO);

        SmtpConfig smtpConfig = smtpConfigRepository.findById(1)
                .orElse(SmtpConfig.builder().smtpId(1).build());

        CryptoUtil.EncryptionResult encryptionResult = cryptoUtil.encrypt(
                smtpConfigDTO.getPassword().getBytes(StandardCharsets.UTF_8));

        smtpConfig.setHost(smtpConfigDTO.getHost());
        smtpConfig.setPort(smtpConfigDTO.getPort());
        smtpConfig.setUsername(smtpConfigDTO.getUsername());
        smtpConfig.setPasswordEncrypted(Base64.getEncoder().encodeToString(encryptionResult.ciphertext()));
        smtpConfig.setPasswordIv(Base64.getEncoder().encodeToString(encryptionResult.iv()));
        smtpConfig.setSender(smtpConfigDTO.getSender());
        smtpConfig.setTlsEnabled(smtpConfigDTO.isTlsEnabled());
        smtpConfig.setTestAddress(null);
        smtpConfig.setConfigConfirmed(false);

        return convertConfigToDto(smtpConfigRepository.save(smtpConfig));
    }

    public SmtpDTO testSmtpConfig(SmtpTestDTO smtpTestDTO) {
        if (smtpTestDTO == null || smtpTestDTO.getTestAddress() == null
                || smtpTestDTO.getTestAddress().trim().isEmpty()) {
            throw new SmtpConfigurationException("Test email address must be provided");
        }

        SmtpConfig smtpConfig = smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Config not found"));

        validateSmtpConfig(smtpConfig);

        JavaMailSender mailSender = dynamicMailSenderService.buildMailSender(smtpConfig);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(smtpConfig.getSender());
        mail.setTo(smtpTestDTO.getTestAddress().trim());
        mail.setSubject("SMTP Test Email - Schroedingers Chat");
        mail.setText("This is a test email to verify your SMTP configuration.");

        try {
            mailSender.send(mail);
            log.info("Test email sent successfully to: {}", smtpTestDTO.getTestAddress());
        } catch (MailException e) {
            log.error("Failed to send test email to {}: {}", smtpTestDTO.getTestAddress(), e.getMessage());
            throw new SmtpConfigurationException("Failed to send test email: " + e.getMessage(), e);
        }

        smtpConfig.setTestAddress(smtpTestDTO.getTestAddress().trim());
        smtpConfig.setConfigConfirmed(true);

        return convertConfigToDto(smtpConfigRepository.save(smtpConfig));
    }

    public SmtpDTO confirmSmtpConfig(SmtpConfirmedDTO smtpConfirmedDTO) {
        SmtpConfig smtpConfig = smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Config not found"));

        smtpConfig.setConfigConfirmed(smtpConfirmedDTO.isConfigConfirmed());

        return convertConfigToDto(smtpConfigRepository.save(smtpConfig));
    }

    public SmtpDTO getSmtpConfig() {
        return convertConfigToDto(smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Config not found")));
    }

    private void validateSmtpConfigDTO(SmtpConfigDTO dto) {
        if (dto.getHost() == null || dto.getHost().trim().isEmpty()) {
            throw new SmtpConfigurationException("Host must not be empty");
        }
        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new SmtpConfigurationException("Username must not be empty");
        }
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new SmtpConfigurationException("Password must not be empty");
        }
        if (dto.getSender() == null || dto.getSender().trim().isEmpty()) {
            throw new SmtpConfigurationException("Sender must not be empty");
        }
    }

    private void validateSmtpConfig(SmtpConfig config) {
        if (config.getHost() == null || config.getHost().trim().isEmpty()) {
            throw new SmtpConfigurationException("SMTP host is not configured");
        }
        if (config.getSender() == null || config.getSender().trim().isEmpty()) {
            throw new SmtpConfigurationException("SMTP sender address is not configured");
        }
        if (config.getUsername() == null || config.getUsername().trim().isEmpty()) {
            throw new SmtpConfigurationException("SMTP username is not configured");
        }
        if (config.getPasswordEncrypted() == null || config.getPasswordEncrypted().isEmpty()) {
            throw new SmtpConfigurationException("SMTP password is not configured");
        }
        if (config.getPasswordIv() == null || config.getPasswordIv().isEmpty()) {
            throw new SmtpConfigurationException("SMTP password IV is not configured");
        }
    }

    private SmtpDTO convertConfigToDto(SmtpConfig smtpConfig) {
        return SmtpDTO.builder()
                .host(smtpConfig.getHost())
                .port(smtpConfig.getPort())
                .username(smtpConfig.getUsername())
                .sender(smtpConfig.getSender())
                .tlsEnabled(smtpConfig.isTlsEnabled())
                .isConfirmed(smtpConfig.isConfigConfirmed())
                .testAddress(smtpConfig.getTestAddress())
                .build();
    }
}