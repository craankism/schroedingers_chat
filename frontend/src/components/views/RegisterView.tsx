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

const RegisterView = (): JSX.Element => {
  const navigate = useNavigate();
  const params = useParams();
  const inviteKey = params.inviteKey || "";

  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const { addUser } = useUserStore();

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    addUser(inviteKey, { email, pwd, displayName });
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
              defaultValue={pwd}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPwd(e.target.value)
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

export default RegisterView;
