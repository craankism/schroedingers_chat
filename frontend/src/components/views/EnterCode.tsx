import type { JSX } from "@emotion/react/jsx-runtime";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore";

const EnterCode = (): JSX.Element => {
  const navigate = useNavigate();

  const [code, setCode] = useState<string>("");
  const { validateRegistrationCode } = useAuthStore();

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const result = await validateRegistrationCode(code);
    console.log(result);
    if (result.valid === true) {
      navigate("/register/" + code);
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
            <Button
              type="button"
              variant="contained"
              sx={{ml: 1}}
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

export default EnterCode;
