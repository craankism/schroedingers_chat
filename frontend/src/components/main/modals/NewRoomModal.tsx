import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, ListItemButton, ListItemText, TextField } from "@mui/material";
import { useUserStore } from "../../../stores/UserStore.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRoomStore } from "../../../stores/RoomStore.ts";
import { decodeJwt } from "../../../stores/AuthStore.ts";
import { modalStyle } from "../../../types/constants/constants.ts";
import { usePropStore } from "../../../stores/PropStore.ts";
import { useNavigate } from "react-router-dom";

type NewRoomModalProps = {
  roomId?: number;
  roomEdit: boolean;
  openModal: boolean;
  closeModal: (setOpenModal: boolean) => void;
  setActiveView?: (view: string) => void;
};

const NewRoomModal: React.FC<NewRoomModalProps> = ({
  roomId,
  roomEdit,
  openModal,
  closeModal,
  setActiveView,
}) => {
  const { users } = useUserStore();
  const { createRoom, updateRoom, rooms } = useRoomStore();
  const { setRoomId } = usePropStore();

  const [name, setName] = React.useState<string>("");
  const [userIdSet, setUserIdSet] = React.useState<number[]>([]);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const currentUserId = decodeJwt()?.userId;
  const navigate = useNavigate();

  const handleClose = () => {
    closeModal(false);
  };

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (editMode) {
      updateRoom({ name, userIdSet }, roomId || 0);
    } else {
      const newRoom = await createRoom({ name, userIdSet });
      setRoomId(newRoom.roomId);
      navigate("/chat");
      if (setActiveView) setActiveView("Chats");
      setUserIdSet([]);
      setName("");
    }
    handleClose();
  };

  React.useEffect(() => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (room) {
      // eslint-disable-next-line
      setName(room.name);
      setUserIdSet(room.userList);
      setEditMode(true);
    } else {
      setUserIdSet(currentUserId ? [currentUserId] : []);
      setEditMode(false);
    }
    // eslint-disable-next-line
  }, [openModal]);

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form onSubmit={submitHandler}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={12}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Room:
                </Typography>
              </Grid>
              <Grid size={12}>
                <TextField
                  id="roomName"
                  type="text"
                  label="Name"
                  disabled={roomEdit}
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
                  Invite Users:
                </Typography>
              </Grid>
              <Grid container spacing={1} size={12}>
                {users.length > 0 ? (
                  users.map((user) => {
                    const isSelected =
                      userIdSet.includes(user.userId) ||
                      currentUserId == user.userId;
                    return (
                      <Grid size={{ xs: 6, md: 3 }} key={user.userId}>
                        <ListItemButton
                          sx={{
                            border: "0.5px solid",
                            p: 1,
                          }}
                          selected={isSelected}
                          disabled={currentUserId == user.userId}
                          onClick={() => {
                            if (isSelected) {
                              setUserIdSet((prev) =>
                                prev.filter((id) => id !== user.userId),
                              );
                            } else {
                              setUserIdSet((prev) => [...prev, user.userId]);
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
                  <Typography>No Users found</Typography>
                )}
              </Grid>
              <Grid size={12}>
                <Button type="submit">Save</Button>
                <Button sx={{ ml: 1 }} onClick={handleClose}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default NewRoomModal;
