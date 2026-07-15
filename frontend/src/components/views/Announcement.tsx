import { Client } from "@stomp/stompjs";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import MessagesDisplay from "../main/chat/MessagesDisplay";
import Message from "../main/chat/Message";
import type { MessageType } from "../../types/MessageType";
import type { JSX } from "@emotion/react/jsx-runtime";
import { decodeJwt } from "../../stores/AuthStore";
import { useMessageStore } from "../../stores/MessageStore";
import { useUserStore } from "../../stores/UserStore";

const Announcement = (): JSX.Element => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [message, setMessage] = useState<string>("");
  const { users } = useUserStore();
  const user = users.find((user) => user.userId === decodeJwt()?.userId);
  const isTrainer = user?.isTrainer === true;
  const isAdmin = user?.isAdmin === true;
  const { setMessages, markMessageDeleted, getMessages } = useMessageStore();

  const getWsUrl = () => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    return `${protocol}://${host}/ws`;
  };

  useEffect(() => {
    const handleConnectionClose = () => setConnectionStatus("Closed");

    const client = new Client({
      brokerURL: getWsUrl(),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      onConnect: () => {
        setConnectionStatus("Open");
        getMessages(1);
        client.subscribe("/topic/1/messages", (incomingMessage) => {
          setMessages(JSON.parse(incomingMessage.body));
        });
        client.subscribe("/topic/1/delete", (incomingMessage) => {
          const deletedMessage = JSON.parse(incomingMessage.body) as {
            messageId: number;
          };
          markMessageDeleted(deletedMessage.messageId);
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
    // eslint-disable-next-line
  }, []);

  const handleDeleteMessage = useCallback((messageId: number) => {
    if (!clientRef.current?.connected) {
      return;
    }
    clientRef.current.publish({
      destination: "/app/chat/1/delete",
      body: JSON.stringify({ messageId }),
    });
  }, []);

  const handleClickSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !clientRef.current?.connected) {
      return;
    }

    clientRef.current.publish({
      destination: "/app/chat/1",
      body: JSON.stringify({
        content: trimmedMessage,
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
        overflow: "hidden",
      }}
    >
      <MessagesDisplay
        connectionStatus={connectionStatus}
        handleDeleteMessage={handleDeleteMessage}
        announcement={true}
      />
      {isTrainer || isAdmin ? (
        <Message
          message={message}
          setMessage={setMessage}
          handleClickSendMessage={handleClickSendMessage}
          isConnected={isConnected}
          announcement={true}
        />
      ) : null}
    </Box>
  );
};

export default Announcement;
