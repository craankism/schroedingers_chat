package sc.backend.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sc.backend.dtos.req.SmtpConfigDTO;
import sc.backend.dtos.req.SmtpConfirmedDTO;
import sc.backend.dtos.req.SmtpTestDTO;
import sc.backend.dtos.res.SmtpDTO;
import sc.backend.services.SmtpConfigService;

@Tag(name = "SMTP", description = "Mail server configuration")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/smtp")
public class SmtpConfigController {

    private final SmtpConfigService smtpConfigService;

    @PostMapping()
    public ResponseEntity<SmtpDTO> createSmtpConfig(@RequestBody SmtpConfigDTO smtpConfigDTO) {
        return new ResponseEntity<>(smtpConfigService.createSmtpConfig(smtpConfigDTO), HttpStatus.CREATED);
    }

    @PutMapping("test")
    public ResponseEntity<SmtpDTO> testSmtpConfig(@RequestBody SmtpTestDTO smtpTestDTO) {
        return new ResponseEntity<>(smtpConfigService.testSmtpConfig(smtpTestDTO), HttpStatus.OK);
    }

    @PutMapping("confirm")
    public ResponseEntity<SmtpDTO> confirmSmtpConfig(@RequestBody SmtpConfirmedDTO smtpConfirmedDTO) {
        return new ResponseEntity<>(smtpConfigService.confirmSmtpConfig(smtpConfirmedDTO), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<SmtpDTO> getSmtpConfig() {
        return new ResponseEntity<>(smtpConfigService.getSmtpConfig(), HttpStatus.OK);
    }
}
