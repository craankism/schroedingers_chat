import type {JSX} from "@emotion/react/jsx-runtime";
import Modal from "@mui/material/Modal";
import {usePropStore} from "../../../stores/PropStore.ts";
import {modalStyle} from "../../../types/constants/constants.ts";
import React from "react";
import {
    Alert, Box, Button,
    Card, CardContent, Checkbox,
    Fade, FormControlLabel, Grid,
    Paper, Step, StepContent,
    Stepper, TextField,
    Typography, useTheme
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import MailLockIcon from "@mui/icons-material/MailLock";
import type {SmtpConfigType} from "../../../types/SmtpConfigType.ts";
import {useSmtpStore} from "../../../stores/SmtpStore.ts";
import NumberField from "../../NumberField.tsx";

const SMTPModal = (): JSX.Element => {
    const theme = useTheme();
    const {smtpModalOpen, setSmtpModalOpen} = usePropStore();
    const {submitSmtp, testSmtp, confirmSmtp, getSmtp, smtpConfig} = useSmtpStore();

    const [host, setHost] = React.useState<string>("");
    const [port, setPort] = React.useState<number>(0);
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [sender, setSender] = React.useState<string>("");
    const [tlsEnabled, setTlsEnabled] = React.useState<boolean>(false);
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    const [testAddress, setTestAddress] = React.useState<string>("");

    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        void getSmtp();
    }, [getSmtp]);

    React.useEffect(() => {
        if (smtpConfig) {
            setHost(smtpConfig.host || "");
            setPort(smtpConfig.port || 0);
            setUsername(smtpConfig.username || "");
            setPassword("");
            setSender(smtpConfig.sender || "");
            setTlsEnabled(smtpConfig.tlsEnabled || false);

            if (smtpConfig.isConfirmed) {
                setActiveStep(2);
            } else if (smtpConfig.testAddress) {
                setActiveStep(1);
            } else {
                setActiveStep(0);
            }
        }
    }, [smtpConfig]);

    const steps = ["Configuration", "Test Email", "Confirmation"];

    const handleClose = () => {
        setSmtpModalOpen(false);
        setHost("");
        setPort(0);
        setUsername("");
        setPassword("");
        setSender("");
        setTlsEnabled(false);
        setIsConfirmed(false);
        setTestAddress("");
        setActiveStep(0);
    };

    const sendConfig = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const smtpConfigData: SmtpConfigType = {
            host: host,
            port: port,
            username: username,
            password: password,
            sender: sender,
            tlsEnabled: tlsEnabled,
        };
        await submitSmtp(smtpConfigData);
        setActiveStep(1);
    };

    const testSmtpHandler = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (smtpConfig) {
            await testSmtp({testAddress: testAddress});
            setActiveStep(1);
        }
    };

    const confirmSmtpHandler = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (smtpConfig?.testAddress) {
            await confirmSmtp({isConfirmed: isConfirmed});
            setActiveStep(2);
        }
        handleClose();
    };

    return (
        <>
            <Modal
                open={smtpModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Fade in={smtpModalOpen} timeout={300}>
                    <Box sx={{...modalStyle, overflowY: "auto", maxHeight: "90vh"}}>
                        <Box sx={{mb: 3}}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
                                SMTP Configuration
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Configure your outgoing mail server to enable email verification for new users
                            </Typography>
                        </Box>

                        <Stepper activeStep={activeStep} sx={{mt: 2}}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <Typography variant="subtitle1">{label}</Typography>
                                    <StepContent>
                                        <Box sx={{ml: 2, borderLeft: `2px solid ${theme.palette.divider}`, pl: 2}}/>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>

                        <Card variant="outlined" sx={{mt: 2}}>
                            <CardContent>
                                <form onSubmit={sendConfig}>
                                    <Grid container spacing={3} sx={{alignItems: "center"}}>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="SMTP Host"
                                                required
                                                value={host}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setHost(e.target.value)
                                                }
                                                helperText="e.g. smtp.gmail.com"
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <NumberField
                                                id="port"
                                                label="Port"
                                                min={1}
                                                max={65535}
                                                defaultValue={587}
                                                value={port}
                                                required
                                                onValueChange={(value: number | null) => setPort(value ?? 587)}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    mt: 0.5,
                                                    display: 'block',
                                                    pl: 2,
                                                    lineHeight: 1.4,
                                                    fontSize: '0.75rem',
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                587 for TLS, 465 for SSL
                                            </Typography>
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Username"
                                                required
                                                value={username}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setUsername(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                type="password"
                                                label="Password"
                                                required
                                                value={password}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                type="email"
                                                label="Sender Address"
                                                required
                                                value={sender}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setSender(e.target.value)
                                                }
                                                helperText="Will be used as 'From' address for all emails"
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={tlsEnabled}
                                                        onChange={(e) => setTlsEnabled(e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label="Enable TLS encryption"
                                            />
                                        </Grid>
                                        <Grid size={12} sx={{mt: 2}}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                startIcon={<SettingsIcon/>}
                                                fullWidth
                                                sx={{
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: theme.palette.primary.contrastText,
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.primary.dark,
                                                    },
                                                }}
                                            >
                                                {smtpConfig ? "Update Configuration" : "Save Configuration"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardContent>
                        </Card>

                        {smtpConfig && (
                            <Fade in={activeStep >= 1} timeout={300}>
                                <Paper variant="outlined" sx={{mt: 2, p: 3}}>
                                    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                        <EmailIcon sx={{mr: 1, color: theme.palette.primary.main}}/>
                                        <Typography variant="subtitle1">Send Test Email</Typography>
                                    </Box>
                                    <Grid container spacing={2} sx={{alignItems: "center"}}>
                                        <Grid size={8}>
                                            <TextField
                                                fullWidth
                                                label="Test Recipient"
                                                required
                                                disabled={!smtpConfig}
                                                value={testAddress}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setTestAddress(e.target.value)
                                                }
                                                helperText="Enter your own email to verify delivery"
                                            />
                                        </Grid>
                                        <Grid size={4}>
                                            <form onSubmit={testSmtpHandler}>
                                                <Button
                                                    type="submit"
                                                    disabled={!smtpConfig}
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<EmailIcon/>}
                                                >
                                                    Send Test
                                                </Button>
                                            </form>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Fade>
                        )}

                        {smtpConfig?.testAddress && (
                            <Fade in={activeStep >= 1} timeout={300}>
                                <Paper variant="outlined" sx={{mt: 2, p: 3}}>
                                    <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                        <MailLockIcon sx={{mr: 1, color: theme.palette.primary.main}}/>
                                        <Typography variant="subtitle1">Confirm Setup</Typography>
                                    </Box>
                                    <form onSubmit={confirmSmtpHandler}>
                                        <Alert
                                            severity={isConfirmed ? "success" : "info"}
                                            sx={{mt: 1, mb: 2}}
                                            icon={<CheckCircleOutlineIcon/>}
                                        >
                                            {isConfirmed
                                                ? "Configuration will be activated upon confirmation"
                                                : `Please check your inbox at ${smtpConfig.testAddress} before confirming`}
                                        </Alert>
                                        <Grid container spacing={2} sx={{alignItems: "center"}}>
                                            <Grid size={1}>
                                                <Checkbox
                                                    checked={isConfirmed}
                                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                                    color="primary"
                                                    size="medium"
                                                />
                                            </Grid>
                                            <Grid size={11}>
                                                <Typography variant="body1">
                                                    I have received the test email at{" "}
                                                    <strong>{smtpConfig.testAddress}</strong>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Button
                                            type="submit"
                                            disabled={!smtpConfig?.testAddress}
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                mt: 2,
                                                backgroundColor: isConfirmed ? theme.palette.success.main : theme.palette.primary.main,
                                                "&:hover": {
                                                    backgroundColor: isConfirmed ? theme.palette.success.dark : theme.palette.primary.dark,
                                                },
                                            }}
                                            startIcon={<CheckCircleOutlineIcon/>}
                                        >
                                            Activate Configuration
                                        </Button>
                                    </form>
                                </Paper>
                            </Fade>
                        )}

                        <Box sx={{mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Button onClick={handleClose}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default SMTPModal;