import { Box, List, Typography } from "@mui/material";
import type React from "react";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../../stores/AuthStore";
import type {MessageInput} from "../../../types/MessageType.ts";

type MessagesDisplayProps = {
  connectionStatus: string;
  messageHistory: MessageInput[];
};

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
  connectionStatus,
  messageHistory,
}) => {
  const { currentUser } = useAuthStore();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to the last message when messageHistory changes
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: 2,
        mr: { xs: "0", md: 30 },
        mb: 7,
      }}
    >
      <Typography sx={{ mb: 2 }}>
        The WebSocket is currently {connectionStatus}
      </Typography>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          pr: 1,
        }}
      >
        {messageHistory.map((message, id) => (
          <Box
            key={id}
            sx={{ display: "flex"}}
            ref={id === messageHistory.length - 1 ? lastMessageRef : null}
          >
            {currentUser?.displayName === message.sender ? (
              <Box sx={{ marginLeft: "auto", textAlign: "right" }}>
                <Typography sx={{ color: "cyan" }}>
                  {message.sender}
                </Typography>
                <Typography>{message.content}</Typography>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ color: "red" }}>
                  {message.sender}
                </Typography>
                <Typography>{message.content}</Typography>
              </Box>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default MessagesDisplay;
