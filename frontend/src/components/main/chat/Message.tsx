import { Box, Button, TextField, Typography, Tooltip, IconButton } from "@mui/material";
import type React from "react";
import { useState } from "react";
import { widthMinusSidebar } from "../../../types/constants/constants";
import { InfoOutlined } from "@mui/icons-material";

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
  const [showAiHint, setShowAiHint] = useState<boolean>(true);
  let md = 30;
  if (announcement) {
    md = 0;
  }

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: "background.paper",
        ml: widthMinusSidebar,
        mr: { xs: 0, md: md },
      }}
    >
        {!announcement && showAiHint && (
            <Box
                sx={{
                    mb: 1,
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                }}
            >
                <Typography variant="caption" color="text.secondary">
                    Ask our Artificial Meowligence 🐈‍⬛ with <Box component="strong">@void</Box> · Mention a filename to let Void inspect it
                </Typography>
            </Box>
        )}
    <Box
        sx={{
            display: "flex",
            gap: 1,
        }}
    >
        {!announcement && (
            <Tooltip title={showAiHint ? "Hide AI hint" : "Show AI hint"}>
                <IconButton
                    aria-label={showAiHint ? "Hide AI hint" : "Show AI hint"}
                    onClick={() => setShowAiHint((current) => !current)}
                >
                    <InfoOutlined />
                </IconButton>
            </Tooltip>
        )}
      <Box sx={{ flex: 1, position: "relative" }}>
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
    </Box>
  );
};
export default Message;
