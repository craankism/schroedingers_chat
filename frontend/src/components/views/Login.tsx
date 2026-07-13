import type { JSX } from "@emotion/react/jsx-runtime";
import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await login({ email, password });
    navigate("/");
  };

  return (
    <form onSubmit={submitHandler}>
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
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
            <Typography variant="h1">Login</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              id="email"
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
      </Box>
    </form>
  );
};

export default Login;
