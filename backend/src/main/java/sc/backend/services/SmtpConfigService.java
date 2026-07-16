package sc.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sc.backend.components.CryptoUtil;
import sc.backend.dtos.req.SmtpConfigDTO;
import sc.backend.dtos.req.SmtpConfirmedDTO;
import sc.backend.dtos.req.SmtpTestDTO;
import sc.backend.dtos.res.SmtpDTO;
import sc.backend.entities.SmtpConfig;
import sc.backend.exceptions.EmptyOptionalException;
import sc.backend.repositories.SmtpConfigRepository;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Transactional
@RequiredArgsConstructor
@Service
public class SmtpConfigService {

    private final SmtpConfigRepository smtpConfigRepository;
    private final CryptoUtil cryptoUtil;

    public SmtpDTO createSmtpConfig(SmtpConfigDTO smtpConfigDTO) {
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
        smtpConfig.setConfirmed(false);

        return convertConfigToDto(smtpConfigRepository.save(smtpConfig));
    }

    public SmtpDTO testSmtpConfig(SmtpTestDTO smtpTestDTO) {
        SmtpConfig smtpConfig = smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Config not found"));

        smtpConfig.setTestAddress(smtpTestDTO.getTestAddress());

        return convertConfigToDto(smtpConfigRepository.save(smtpConfig));
    }

    public SmtpDTO confirmSmtpConfig(SmtpConfirmedDTO smtpConfirmedDTO) {
        SmtpConfig smtpConfig = smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Config not found"));

        smtpConfig.setConfirmed(smtpConfirmedDTO.isConfirmed());

        return convertConfigToDto(smtpConfigRepository.save(smtpConfig));
    }

    public SmtpDTO getSmtpConfig() {
        return convertConfigToDto(smtpConfigRepository.findById(1)
                .orElseThrow(() -> new EmptyOptionalException("SMTP Config not found")));
    }

    private SmtpDTO convertConfigToDto(SmtpConfig smtpConfig) {
        return SmtpDTO.builder()
                .host(smtpConfig.getHost())
                .port(smtpConfig.getPort())
                .username(smtpConfig.getUsername())
                .sender(smtpConfig.getSender())
                .tlsEnabled(smtpConfig.isTlsEnabled())
                .isConfirmed(smtpConfig.isConfirmed())
                .testAddress(smtpConfig.getTestAddress())
                .build();
    }


}
