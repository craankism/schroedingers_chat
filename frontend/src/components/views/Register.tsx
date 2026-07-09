import type { JSX } from "@emotion/react/jsx-runtime";
import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../../stores/UserStore";
import { useNotificationStore } from "../../stores/NotificationStore";

const Register = (): JSX.Element => {
  const navigate = useNavigate();
  const params = useParams();
  const inviteKey = params.inviteKey || "";

  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { addUser } = useUserStore();

  const hasUpperCase = (password: string) => {
    return password !== password.toLowerCase();
  };
  const hasNumber = (password: string) => {
    return /\d/.test(password);
  };

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (displayName.length > 16) {
      useNotificationStore
        .getState()
        .addNotification("Username too long (max. 16 characters)", "error");
      return;
    }
    if (!hasUpperCase(password) || !hasNumber || password.length < 8) {
      useNotificationStore
        .getState()
        .addNotification(
          "Password too weak. Need to be min. 8 digits, contain atleast 1 upper case letter and 1 number",
          "error",
        );
      return;
    }
    addUser(inviteKey, { email, password, displayName });
    navigate("/login");
  };

  return (
    <form onSubmit={submitHandler}>
      <Container
        sx={{
          display: "flex",
          minHeight: { xs: "calc(100vh - 68.5px)", md: "calc(100vh - 64px)" },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          sx={{
            maxWidth: { xs: "90%", md: "30%" },
            gap: 2,
          }}
        >
          <Grid size={12}>
            <Typography variant="h1">Register</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              id="username"
              type="text"
              label="Username"
              variant="outlined"
              fullWidth
              defaultValue={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDisplayName(e.target.value)
              }
            />
          </Grid>
          <Grid size={12}>
            <TextField
              id="username"
              type="email"
              label="E-Mail"
              variant="outlined"
              fullWidth
              defaultValue={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Grid>
          <Grid size={12}>
            <TextField
              id="password"
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              defaultValue={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              REGISTER
            </Button>
          </Grid>
          <Grid>
            <Link
              onClick={() => navigate("/login")}
              underline="none"
              sx={{ cursor: "pointer" }}
            >
              <Typography>Already have an Account?</Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default Register;
