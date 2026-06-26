import type { JSX } from "@emotion/react/jsx-runtime";
import { Client } from "@stomp/stompjs";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import MessagesDisplay from "./MessagesDisplay";
import Message from "./Message";
import { heightMinusTopNav } from "../../../types/constants/constants";
import type { MessageType } from "../../../types/MessageType";

const Chat = (): JSX.Element => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const handleConnectionClose = () => setConnectionStatus("Closed");

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      onConnect: () => {
        setConnectionStatus("Open");
        client.subscribe("/topic/messages", (incomingMessage) => {
          setMessageHistory((prev) => [...prev, incomingMessage.body]);
        });
      },
      onWebSocketClose: handleConnectionClose,
      onWebSocketError: handleConnectionClose,
      onStompError: handleConnectionClose,
    });

    clientRef.current = client;
    client.activate();

    return () => {
      void client.deactivate();
    };
  }, []);

  const handleClickSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !clientRef.current?.connected) {
      return;
    }

    clientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        content: trimmedMessage
      } as MessageType),
    });
    setMessage("");
  }, [message]);

  const isConnected = connectionStatus === "Open";

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        mt: heightMinusTopNav,
        overflow: "hidden",
        pb: "80px", // Account for fixed Message input at bottom
      }}
    >
      <MessagesDisplay
        connectionStatus={connectionStatus}
        messageHistory={messageHistory}
      />
      <Message
        message={message}
        setMessage={setMessage}
        handleClickSendMessage={handleClickSendMessage}
        isConnected={isConnected}
      />
    </Box>
  );
};

export default Chat;
