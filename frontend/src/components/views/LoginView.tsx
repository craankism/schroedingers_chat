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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";

const LoginView = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await login({ email, password });
    if (useAuthStore.getState().isAuthenticated) {
      await navigate("/");
    }
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
            <Typography variant="h1">Login</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              id="username"
              type="email"
              label="Username"
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
              LOGIN
            </Button>
          </Grid>
          <Grid>
            <Link
              onClick={() => navigate("/register")}
              underline="none"
              sx={{ cursor: "pointer" }}
            >
              <Typography>Create Account</Typography>
            </Link>
            <Link
              onClick={() => navigate("/placeholder")}
              underline="none"
              sx={{ cursor: "pointer" }}
            >
              <Typography>Forgot Password?</Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default LoginView;
