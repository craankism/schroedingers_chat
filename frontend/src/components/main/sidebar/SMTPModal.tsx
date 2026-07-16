import type {JSX} from "@emotion/react/jsx-runtime";
import Modal from "@mui/material/Modal";
import {usePropStore} from "../../../stores/PropStore.ts";
import {modalStyle} from "../../../types/constants/constants.ts";
import React from "react";
import {Box, Button, Checkbox, FormControlLabel, Grid, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import NumberField from "../../NumberField.tsx";
import type {SmtpConfigType} from "../../../types/SmtpConfigType.ts";
import {useSmtpStore} from "../../../stores/SmtpStore.ts";

const SMTPModal = (): JSX.Element => {

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

    React.useEffect(() => {
        getSmtp();
    }, [])

    const handleClose = () => {
        setSmtpModalOpen(false);
    }

    const sendConfig = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const smtpConfig: SmtpConfigType = {
            host: host,
            port: port,
            username: username,
            password: password,
            sender: sender,
            tlsEnabled: tlsEnabled,
        }
        await submitSmtp(smtpConfig);
    }

    const testSmtpHandler = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (smtpConfig) {
            await testSmtp({testAddress: testAddress});
        }
    }

    const confirmSmtpHandler = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (smtpConfig?.testAddress) {
            await confirmSmtp({isConfirmed: isConfirmed});
        }
    }

    return (
        <>
            <Modal open={smtpModalOpen}
                   onClose={handleClose}
                   aria-labelledby="modal-modal-title"
                   aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <form onSubmit={sendConfig}>
                        <Grid container spacing={2} sx={{alignItems: "center"}}>
                            <Grid size={12}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    SMTP Configuration
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <TextField id="host" type="text" label="SMTP Server" required fullWidth value={host}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}/>
                                <NumberField id="port" label="Port" min={1} max={65535} defaultValue={587} value={port}
                                             required onValueChange={(value) => {
                                    setPort(value ?? 587)
                                }}/>
                                <TextField id="username" type="email" label="User Name" required fullWidth
                                           value={username}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>
                                <TextField id="password" type="password" label="Password" required fullWidth
                                           value={password}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
                                <TextField id="sender" type="email" label="Sender Address" required fullWidth
                                           value={sender}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSender(e.target.value)}/>
                                <FormControlLabel label={"TLS enabled"} required control={<Checkbox checked={tlsEnabled}
                                                                                                    onChange={(e) =>
                                                                                                        setTlsEnabled(e.target.checked)}/>}
                                />
                            </Grid>
                            <Grid size={12}>
                                <Button type="submit">Send Config</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <form onSubmit={testSmtpHandler}>
                        <Grid container spacing={2} sx={{alignItems: "center"}}>
                            <Grid size={12}>
                                <TextField disabled={!smtpConfig} id="testAddress" type="email" label="Test Address"
                                           required fullWidth
                                           value={testAddress}
                                           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                               setTestAddress(e.target.value)}/>
                            </Grid>
                            <Grid size={12}>
                                <Button disabled={!smtpConfig} type="submit">Send Test Mail</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <form onSubmit={confirmSmtpHandler}>
                        <Grid container spacing={2} sx={{alignItems: "center"}}>
                            <Grid size={12}>
                                <FormControlLabel disabled={!smtpConfig?.testAddress} label={"Test Email received"}
                                                  required
                                                  control={<Checkbox checked={isConfirmed}
                                                                     onChange={(e) =>
                                                                         setIsConfirmed(e.target.checked)}/>}
                                />
                            </Grid>
                            <Button disabled={!smtpConfig?.testAddress} type="submit">Confirm Configuration</Button>
                        </Grid>
                    </form>
                    <Button onClick={handleClose}>Cancel</Button>
                </Box>
            </Modal>
        </>
    );
}

export default SMTPModal;