import { List, Typography } from "@mui/material";
import type React from "react";

type MessagesDisplayProps = {
  connectionStatus: string;
  messageHistory: string[];
};

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
  connectionStatus,
  messageHistory,
}) => {
  return (
    <>
      <Typography>The WebSocket is currently {connectionStatus}</Typography>
      <List>
        {messageHistory.map((message, idx) => (
          <Typography key={idx}>{message}</Typography>
        ))}
      </List>
    </>
  );
};

export default MessagesDisplay;
