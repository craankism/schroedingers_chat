import { Box, Button, TextField, Typography } from "@mui/material";
import type React from "react";
import { useState } from "react";

type MessageProps = {
  message: string;
  setMessage(message: string): void;
  handleClickSendMessage(): void;
  isConnected: boolean;
  announcement: boolean;
};

const Message: React.FC<MessageProps> = ({
  message,
  setMessage,
  handleClickSendMessage,
  isConnected,
  announcement,
}) => {
  const [messageTooLong, setMessageTooLong] = useState<boolean>(false);
  let md = "240px";
  if (announcement) {
    md = "0px";
  }
  return (
    <Box
      sx={{
        ml: { xs: 0, md: "240px" },
        mr: { xs: 0, md: md },
        display: "flex",
        gap: 1,
        p: 1,
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ position: "relative", flexGrow: 1 }}>
        <TextField
          id="message"
          variant="outlined"
          multiline
          fullWidth
          sx={{ maxHeight: 200, overflow: "scroll" }}
          slotProps={{ input: { sx: { pb: 3 } } }}
          value={message}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setMessage(e.target.value);
            if (e.target.value.length > 4000) {
              setMessageTooLong(true);
            } else if (e.target.value.length <= 4000) {
              setMessageTooLong(false);
            }
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              isConnected &&
              !messageTooLong
            ) {
              e.preventDefault();
              handleClickSendMessage();
            }
          }}
        />
        <Typography
          sx={{
            position: "absolute",
            bottom: 8,
            right: 12,
            fontSize: "0.75rem",
            color: "text.secondary",
            pointerEvents: "none",
          }}
        >
          {message.length}/4000
        </Typography>
      </Box>
      <Button
        onClick={handleClickSendMessage}
        disabled={!isConnected || messageTooLong}
      >
        Send
      </Button>
    </Box>
  );
};
export default Message;
