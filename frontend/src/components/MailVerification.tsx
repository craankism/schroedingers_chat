import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useAuthStore } from "../stores/AuthStore";
import type { JSX } from "@emotion/react/jsx-runtime";

const MailVerification = (): JSX.Element => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();

  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState<string | null>(
    token ? null : "Verification token is missing.",
  );

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .catch(() =>
        setError("Verification failed. The link may be invalid or expired."),
      )
      .finally(() => setLoading(false));
  }, [token, verifyEmail]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return <></>;
};

export default MailVerification;
