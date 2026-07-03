import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { decodeJwt } from "../../../stores/AuthStore";
import { useUserStore } from "../../../stores/UserStore";
import type { JSX } from "@emotion/react/jsx-runtime";
import { usePropStore } from "../../../stores/PropStore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90vw", md: 800 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProfileModal = (): JSX.Element => {
  const { updateUser, getUser, getAllUsers } = useUserStore();

  const [displayName, setDisplayName] = React.useState<string>("");
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [repeatNewPassword, setRepeatNewPassword] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isTrainer, setIsTrainer] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<number>(0);
  const { openProfile, setOpenProfile } = usePropStore();

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(decodeJwt()?.userId || 0);
      if (user) {
        setDisplayName(user.displayName);
        setEmail(user.email);
        setIsAdmin(user.isAdmin ?? false);
        setIsTrainer(user.isTrainer ?? false);
        setUserId(user.userId);
      }
    };
    fetchUser();
  }, [getAllUsers, getUser]);

  const handleClose = () => setOpenProfile(false);

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (newPassword === repeatNewPassword) {
      updateUser(userId, {
        displayName,
        oldPassword,
        newPassword,
      });
    }
  };

  return (
    <Modal
      open={openProfile}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={submitHandler}>
        <Box sx={style}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                alt="profile picture"
                src=""
                sx={{
                  width: { xs: "40%", md: "100%" },
                  height: "auto",
                  aspectRatio: "1",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Profile:
                </Typography>
                <TextField
                  type="text"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  required
                  value={displayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDisplayName(e.target.value)
                  }
                />
                <TextField
                  type="password"
                  label="Old Password"
                  variant="outlined"
                  fullWidth
                  required
                  value={oldPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOldPassword(e.target.value)
                  }
                />
                <TextField
                  type="password"
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  value={newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPassword(e.target.value)
                  }
                />
                <TextField
                  type="password"
                  label="Repeat New Password"
                  variant="outlined"
                  fullWidth
                  required={newPassword != ""}
                  value={repeatNewPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRepeatNewPassword(e.target.value)
                  }
                />
                <TextField
                  type="email"
                  label="E-Mail"
                  variant="outlined"
                  disabled
                  fullWidth
                  value={email}
                />
                <FormControlLabel
                  disabled
                  control={<Checkbox checked={isTrainer} />}
                  label="Trainer"
                />
                <FormControlLabel
                  disabled
                  control={<Checkbox checked={isAdmin} />}
                  label="Admin"
                />
                <Button onClick={() => setOpenProfile(false)}>Back</Button>
                <Button type="submit">Save</Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Modal>
  );
};

export default ProfileModal;
