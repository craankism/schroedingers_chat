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
import { useNotificationStore } from "../../../stores/NotificationStore";
import ConfirmationModal from "./ConfirmationModal";
import { ThemeSwitcher } from "../ThemeSwitcher.tsx";

const style = {
  margin: "auto",
  width: { xs: "90vw", md: 800 },
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

const ProfileModal = (): JSX.Element => {
  const { updateUser, getUser, getAllUsers, deleteUser } = useUserStore();

  const [displayName, setDisplayName] = React.useState<string>("");
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [repeatNewPassword, setRepeatNewPassword] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isTrainer, setIsTrainer] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<number>(0);
  const {
    openProfile,
    setOpenProfile,
    setOpenConfirmation,
    confirmation,
    setConfirmation,
  } = usePropStore();

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

  const hasUpperCase = (password: string) => {
    return password !== password.toLowerCase();
  };
  const hasNumber = (password: string) => {
    return /\d/.test(password);
  };
  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (displayName.length > 16) {
      useNotificationStore
        .getState()
        .addNotification("Username too long (max. 16 characters)", "error");
      return;
    }
    if (
      newPassword.length > 0 &&
      (!hasUpperCase(newPassword) ||
        !hasNumber(newPassword) ||
        newPassword.length < 8)
    ) {
      useNotificationStore
        .getState()
        .addNotification(
          "Password too weak. Need to be min. 8 digits, contain atleast 1 upper case letter and 1 number",
          "error",
        );
      return;
    }
    if (newPassword === repeatNewPassword) {
      const response = await updateUser(userId, {
        displayName,
        oldPassword,
        newPassword,
      });
      if (response === true) {
        setOpenProfile(false);
      }
    } else {
      useNotificationStore
        .getState()
        .addNotification("Passwords don't match", "error");
    }
  };

  React.useEffect(() => {
    if (confirmation == true && openProfile == true) {
      deleteUser(userId);
      setOpenProfile(false);
      setConfirmation(false);
    }
    // eslint-disable-next-line
  }, [confirmation]);

  return (
    <Modal
      open={openProfile}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
      }}
    >
      <form onSubmit={submitHandler}>
        <Box sx={style}>
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  flexGrow: { xs: 0, md: 1 },
                  minHeight: { xs: 120, md: "auto" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
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
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  pb: 1,
                }}
              >
                <ThemeSwitcher />
              </Box>
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
                <Button
                  onClick={() => setOpenConfirmation(true)}
                  sx={{
                    borderColor: "error.main",
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                    "&:hover": {
                      backgroundColor: "error.dark",
                      borderColor: "error.dark",
                    },
                  }}
                >
                  Delete Account
                </Button>
                <Button onClick={() => setOpenProfile(false)}>Back</Button>
                <Button type="submit">Save</Button>
                <ConfirmationModal />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Modal>
  );
};

export default ProfileModal;
