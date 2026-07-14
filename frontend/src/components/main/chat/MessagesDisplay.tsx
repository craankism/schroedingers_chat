import {Box, CircularProgress, List, Typography} from "@mui/material";
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
  isVoidThinking: boolean;
};

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
    connectionStatus,
    handleDeleteMessage,
    announcement,
    isVoidThinking,
}) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { messages } = useMessageStore();
  const { users } = useUserStore();

  // Scroll to the last message whenever messages change.
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isVoidThinking]);

  let md = 30;
  if (announcement) {
    md = 0;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        pl: 2,
        pr: 2,
        mr: { xs: "0", md: md },
        ml: widthMinusSidebar,
        overflow: "auto",
        height: "92vh",
      }}
    >
      <Typography sx={{ mb: 2, mt: 2 }}>
        The WebSocket is currently {connectionStatus}
      </Typography>
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((message, id) => (
          <Box
            key={id}
            sx={{ display: "flex" }}
            //ref is used at the bottom now
            //ref={id === messages.length - 1 ? lastMessageRef : null}
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

          {isVoidThinking && (
              <Box
                  sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                      mb: 1,
                      opacity: 0.7,
                  }}
              >
                  <CircularProgress size={16} />

                  <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic" }}
                  >
                      Void is both thinking and not thinking...
                  </Typography>
              </Box>
          )}

          {/*Scroll both for messages and Void thinking*/}
          <Box ref={lastMessageRef} />
      </List>
    </Box>
  );
};

export default MessagesDisplay;
