import type { JSX } from "@emotion/react/jsx-runtime";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterCodeView = (): JSX.Element => {
  const navigate = useNavigate();

  const [code, setCode] = useState<string>("");

  const submitHandler = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Code Validation here
    navigate("/register");
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
            <Typography variant="h1">Enter Code</Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              id="code"
              type="text"
              label="Code"
              variant="outlined"
              fullWidth
              defaultValue={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCode(e.target.value)
              }
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default EnterCodeView;
