import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/apiCalls";
import { useNotificationStore } from "../../stores/NotificationStore";

const ForgotPassword = (): JSX.Element => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setSubmitDisabled(true);
    setTimeout(() => setSubmitDisabled(false), 15000);
    try {
      const data = await authApi.forgotPassword(email);
      useNotificationStore.getState().addNotification(data, "info");
    } catch {
      setSubmitDisabled(false);
      useNotificationStore
        .getState()
        .addNotification("Error sending E-Mail", "error");
    }
    navigate("/login");
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
            <Typography variant="h1">Enter E-Mail</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              id="emailforgot"
              type="email"
              label="Email"
              variant="outlined"
              fullWidth
              defaultValue={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained" disabled={submitDisabled}>
              Submit
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

export default ForgotPassword;
