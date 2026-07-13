import { Box, List, Typography } from "@mui/material";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { decodeJwt } from "../../../stores/AuthStore";
import { Clear } from "@mui/icons-material";
import { widthMinusSidebar } from "../../../types/constants/constants.ts";
import { useMessageStore } from "../../../stores/MessageStore.ts";
import Markdown from "react-markdown";
import { useUserStore } from "../../../stores/UserStore.ts";

type MessagesDisplayProps = {
  connectionStatus: string;
  handleDeleteMessage: (messageId: number) => void;
  announcement: boolean;
};

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
  connectionStatus,
  handleDeleteMessage,
  announcement,
}) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { messages } = useMessageStore();
  const { users } = useUserStore();

  // Scroll to the last message whenever messages change.
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        {messages.map((message, id) => (
          <Box
            key={id}
            sx={{ display: "flex" }}
            ref={id === messages.length - 1 ? lastMessageRef : null}
          >
            {decodeJwt()?.userId === message.userId ? (
              <Box
                sx={{ marginLeft: "auto", textAlign: "right" }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Box>
                  <Typography sx={{ color: "cyan" }}>
                    {
                        users.find((user) => user.userId == message.userId)
                              ?.displayName
                    }
                  </Typography>
                  {message.content != null ? (
                    <Box
                      sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                      <Markdown>{message.content}</Markdown>
                    </Box>
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
                <Typography sx={{ color: "red" }}>
                    {
                        users.find((user) => user.userId === message.userId)?.displayName ??
                        "Void 🐈‍⬛"
                    }
                </Typography>
                {message.content != null ? (
                  <Box
                    sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                  >
                    <Markdown>{message.content}</Markdown>
                  </Box>
                ) : (
                  <Typography sx={{ opacity: "30%" }}>
                    Message deleted
                  </Typography>
                )}
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
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default MessagesDisplay;
