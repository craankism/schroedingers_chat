import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApi } from "../../services/apiCalls";
import { useNotificationStore } from "../../stores/NotificationStore";

const ResetPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

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
    if (
      !hasUpperCase(newPassword) ||
      !hasNumber(newPassword) ||
      newPassword.length < 8
    ) {
      useNotificationStore
        .getState()
        .addNotification(
          "Password too weak. Need to be min. 8 digits, contain atleast 1 upper case letter and 1 number",
          "error",
        );
      return;
    }
    if (newPassword !== confirmPassword) {
      useNotificationStore
        .getState()
        .addNotification("Passwords don't match", "error");
      return;
    }
    try {
      await authApi.resetPassword(token!, newPassword);
      useNotificationStore
        .getState()
        .addNotification("Password changed", "success");
      navigate("/login");
    } catch {
      useNotificationStore
        .getState()
        .addNotification("Password could not be reset. Try again", "error");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          sx={{
            maxWidth: { xs: "90%", md: "20%" },
            gap: 2,
          }}
        >
          <Grid size={12}>
            <Typography variant="h1">Reset Password</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              type="password"
              label="New Password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              Save
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={{ ml: 1 }}
              onClick={() => navigate("/login")}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default ResetPassword;
