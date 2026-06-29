import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import type { JSX } from "@emotion/react/jsx-runtime";
import { Grid, ListItemButton, ListItemText, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { drawerWidth } from "./Sidebar";
import { useUserStore } from "../../../stores/UserStore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRoomStore } from "../../../stores/RoomStore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100vw", md: 800 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NewRoomModal = (): JSX.Element => {
  const [name, setName] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const [userIdSet, setuserIdSet] = React.useState<number[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setuserIdSet([]);
    setName("");
  };

  const { getAllUsers, users } = useUserStore();
  const { createRoom } = useRoomStore();

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    createRoom({ name, userIdSet });
    handleClose();
  };

  return (
    <div>
      <AddIcon
        sx={{ cursor: "pointer", ml: drawerWidth / 10, mt: 1 }}
        onClick={() => {
          handleOpen();
          getAllUsers();
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={submitHandler}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={12}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Raum erstellen:
                </Typography>
              </Grid>
              <Grid size={12}>
                <TextField
                  id="roomName"
                  type="text"
                  label="Name"
                  required
                  fullWidth
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </Grid>
              <Grid size={12}>
                <Typography id="modal-modal-title" component="h2">
                  Personen einladen:
                </Typography>
              </Grid>
              <Grid container spacing={1} size={12}>
                {users.length > 0 ? (
                  users.map((user, index) => {
                    const isSelected = userIdSet.includes(user.userId);
                    return (
                      <Grid size={{ xs: 4, md: 3 }} key={index}>
                        <ListItemButton
                          sx={{
                            border: "solid, 0.5px",
                            p: 1,
                          }}
                          selected={isSelected}
                          onClick={() => {
                            if (isSelected) {
                              setuserIdSet((prev) =>
                                prev.filter((id) => id !== user.userId),
                              );
                            } else {
                              setuserIdSet((prev) => [...prev, user.userId]);
                            }
                          }}
                        >
                          <ListItemText primary={user.displayName} />
                          <CheckCircleIcon
                            sx={{
                              visibility: isSelected ? "visible" : "hidden",
                            }}
                          />
                        </ListItemButton>
                      </Grid>
                    );
                  })
                ) : (
                  <Typography>Keine User gefunden</Typography>
                )}
              </Grid>
              <Grid size={12}>
                <Button type="submit">Raum erstellen</Button>
                <Button sx={{ml: 1}} onClick={handleClose}>Zurück</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default NewRoomModal;
