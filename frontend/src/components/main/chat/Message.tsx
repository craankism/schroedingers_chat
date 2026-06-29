import { Box, Button, TextField } from "@mui/material";
import type React from "react";

type MessageProps = {
  message: string;
  setMessage(message: string): void;
  handleClickSendMessage(): void;
  isConnected: boolean;
};

const Message: React.FC<MessageProps> = ({
  message,
  setMessage,
  handleClickSendMessage,
  isConnected,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: { xs: 0, md: "240px" },
        right: { xs: 0, md: "240px" },
        zIndex: 1200,
        display: "flex",
        gap: 1,
        p: 1,
        bgcolor: "background.paper",
      }}
    >
      <TextField
        id="message"
        type="text"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" && isConnected) {
            e.preventDefault();
            handleClickSendMessage();
          }
        }}
      />
      <Button onClick={handleClickSendMessage} disabled={!isConnected}>
        Send
      </Button>
    </Box>
  );
};
export default Message;
