import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import type {JSX} from "@emotion/react/jsx-runtime";
import AddLinkIcon from "@mui/icons-material/AddLink";
import {Checkbox, FormControlLabel, Grid, TextField} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {useAuthStore} from "../../../stores/AuthStore";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const InviteModal = (): JSX.Element => {
    const [isTrainer, setIsTrainer] = React.useState<boolean>(false);
    const [link, setLink] = React.useState<string>("");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {addRegistrationCode} = useAuthStore();

    const submitHandler = async (
        e: React.SubmitEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        const result = await addRegistrationCode({isTrainer});
        if (result) {
            setLink(result);
        }
    };

    return (
        <div>
            <Button onClick={handleOpen}>
                <AddLinkIcon/>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container spacing={2} sx={{alignItems: "center"}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Einladung erstellen:
                        </Typography>
                        <form onSubmit={submitHandler}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={{isTrainer}}
                                        onChange={() => setIsTrainer(!isTrainer)}
                                    />
                                }
                                label="Trainer"
                            />
                            <br/>
                            <Button type="submit">Link erstellen</Button>
                        </form>
                        {link !== "" ? (
                            <>
                                <TextField value={link}/>{" "}
                                <ContentCopyIcon
                                    sx={{cursor: "pointer"}}
                                    onClick={() => {
                                        navigator.clipboard.writeText(link);
                                        handleClose();
                                        setIsTrainer(false);
                                        setLink("");
                                    }}
                                />
                            </>
                        ) : null}
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default InviteModal;
