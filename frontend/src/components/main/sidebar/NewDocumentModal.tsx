import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, ListItemButton, ListItemText, TextField } from "@mui/material";
import { useUserStore } from "../../../stores/UserStore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { decodeJwt } from "../../../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useDocumentStore } from "../../../stores/DocumentStore";
import { usePropStore } from "../../../stores/PropStore";
import { useNavigate } from "react-router-dom";
import { modalStyle } from "../../../types/constants/constants.ts";

const NewDocumentModal = (): JSX.Element => {
  const { users } = useUserStore();
  const { createDocument } = useDocumentStore();

  const [name, setName] = React.useState<string>("");
  const [userList, setUserList] = React.useState<number[]>([]);
  const currentUserId = decodeJwt()?.userId;

  const { newDocModalOpen, setNewDocModalOpen, setOpenSidebar } =
    usePropStore();
  const navigate = useNavigate();

  const handleClose = () => {
    setNewDocModalOpen(false);
  };

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    createDocument({ title: name, documentMembershipList: userList });
    setUserList([]);
    setName("");
    handleClose();
    setOpenSidebar(false);
    navigate("/editor");
  };

  return (
    <div>
      <Modal
        open={newDocModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <form onSubmit={submitHandler}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={12}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  File:
                </Typography>
              </Grid>
              <Grid size={12}>
                <TextField
                  id="docName"
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
                  Invite Users:
                </Typography>
              </Grid>
              <Grid container spacing={1} size={12}>
                {users.length > 0 ? (
                  users.map((user, index) => {
                    const isSelected =
                      userList.includes(user.userId) ||
                      currentUserId == user.userId;
                    return (
                      <Grid size={{ xs: 6, md: 3 }} key={index}>
                        <ListItemButton
                          sx={{
                            border: "0.5px solid",
                            p: 1,
                          }}
                          selected={isSelected}
                          disabled={currentUserId == user.userId}
                          onClick={() => {
                            if (isSelected) {
                              setUserList((prev) =>
                                prev.filter((id) => id !== user.userId),
                              );
                            } else {
                              setUserList((prev) => [...prev, user.userId]);
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
                <Button type="submit">Create</Button>
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

export default NewDocumentModal;
