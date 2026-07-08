import { Box, List, Typography } from "@mui/material";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { decodeJwt } from "../../../stores/AuthStore";
import type { MessageInput } from "../../../types/MessageType.ts";
import { Clear } from "@mui/icons-material";
import { widthMinusSidebar } from "../../../types/constants/constants.ts";
type MessagesDisplayProps = {
  connectionStatus: string;
  messageHistory: MessageInput[];
  handleDeleteMessage: (messageId: number) => void;
  announcement: boolean;
};

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
  connectionStatus,
  messageHistory,
  handleDeleteMessage,
  announcement,
}) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Scroll to the last message when messageHistory changes
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);

  let md = 30;
  if (announcement) {
    md = 0;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: 2,
        mr: { xs: "0", md: md },
        ml: widthMinusSidebar,
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
            sx={{ display: "flex" }}
            ref={id === messageHistory.length - 1 ? lastMessageRef : null}
          >
            {decodeJwt()?.displayName === message.sender ? (
              <Box
                sx={{ marginLeft: "auto", textAlign: "right" }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Box>
                  <Typography sx={{ color: "cyan" }}>
                    {message.sender}
                  </Typography>
                  {message.content != null ? (
                    <Typography>{message.content}</Typography>
                  ) : (
                    <Typography sx={{ opacity: "30%" }}>
                      Message deleted
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    visibility:
                      hoveredId === id && message.content != null
                        ? "visible"
                        : "hidden",
                  }}
                >
                  <Clear
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleDeleteMessage(message.messageId)}
                  />
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography sx={{ color: "red" }}>{message.sender}</Typography>
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
