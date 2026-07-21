import { Avatar, Box, CircularProgress, List, Typography } from "@mui/material";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { decodeJwt } from "../../../stores/AuthStore";
import { ArrowUpward, Clear } from "@mui/icons-material";
import {
  heightMinusTopNav,
  widthMinusSidebar,
} from "../../../types/constants/constants.ts";
import { useMessageStore } from "../../../stores/MessageStore.ts";
import Markdown from "react-markdown";
import { useUserStore } from "../../../stores/UserStore.ts";
import { usePropStore } from "../../../stores/PropStore.ts";
import { useProfilePictureStore } from "../../../stores/ProfilePictureStore.ts";
import voidProfilePicture from "../../../assets/iconSC.png";

type MessagesDisplayProps = {
  connectionStatus: string;
  handleDeleteMessage: (messageId: number) => void;
  announcement: boolean;
  isVoidThinking: boolean;
  roomId: number;
};

const MessagesDisplay: React.FC<MessagesDisplayProps> = ({
  connectionStatus,
  handleDeleteMessage,
  announcement,
  isVoidThinking,
  roomId,
}) => {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [index, setIndex] = useState<number>(1);
  const { messages, hasMore, getFiftyMessages } = useMessageStore();

  useEffect(() => {
    // eslint-disable-next-line
    setIndex(1);
    lastMessageIdRef.current = undefined;
  }, [roomId]);

  const { users } = useUserStore();
  const { voidName } = usePropStore();
  const { profilePictures } = useProfilePictureStore();

  // Scroll only when a genuinely new message is appended or Void is thinking.
  useEffect(() => {
    const lastId = messages.at(-1)?.messageId;
    if (lastId !== undefined && lastId !== lastMessageIdRef.current) {
      const prev = lastMessageIdRef.current;
      lastMessageIdRef.current = lastId;
      if (prev === undefined || lastId > prev) {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isVoidThinking]);

  let md = 30;
  if (announcement) {
    md = 0;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        pl: 2,
        pr: 2,
        ml: widthMinusSidebar,
        mr: { xs: 0, md: md },
        mt: heightMinusTopNav,
        overflow: "auto",
        height: "92vh",
      }}
    >
      <Typography sx={{ mb: 2, mt: 2 }}>
        The WebSocket is currently {connectionStatus}
      </Typography>
      {hasMore && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-end",
            cursor: "pointer",
            mr: 0.5,
          }}
          onClick={() => {
            const container = containerRef.current;
            const prevScrollHeight = container?.scrollHeight ?? 0;
            getFiftyMessages(roomId, index).then(() => {
              if (container) {
                container.scrollTop +=
                  container.scrollHeight - prevScrollHeight;
              }
            });
            setIndex(index + 1);
          }}
        >
          <Typography>Load more</Typography>
          <ArrowUpward sx={{ fontSize: 40 }} />
        </Box>
      )}

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
              <>
                <Box
                  sx={{
                    marginLeft: "auto",
                    textAlign: "right",
                    alignItems: "center",
                    justifyContent: "right",
                    width: "100%",
                  }}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Typography sx={{ color: "cyan" }}>
                    {
                      users.find((user) => user.userId === message.userId)
                        ?.displayName
                    }
                  </Typography>
                  {message.content != null ? (
                    <Box
                      sx={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
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
                <Avatar
                  alt="profile picture"
                  src={
                    profilePictures.find((pic) => pic.userId === message.userId)
                      ?.url
                  }
                  sx={{ width: "50px", height: "50px", ml: 2 }}
                />
              </>
            ) : (
              <>
                <Avatar
                  alt="profile picture"
                  src={
                    message.userId === null
                      ? voidProfilePicture
                      : profilePictures.find(
                          (pic) => pic.userId === message.userId,
                        )?.url
                  }
                  sx={{ width: "50px", height: "50px", mr: 2 }}
                />
                <Box
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "red" }}>
                    {users.find((user) => user.userId === message.userId)
                      ?.displayName ?? voidName}
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
              </>
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

            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
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
