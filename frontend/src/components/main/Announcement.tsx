import { Client } from "@stomp/stompjs";
import { Box } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import MessagesDisplay from "./chat/MessagesDisplay";
import Message from "./chat/Message";
import { heightMinusTopNav } from "../../types/constants/constants";
import type { MessageInput, MessageType } from "../../types/MessageType";
import { roomApi } from "../../services/apiCalls";
import type { JSX } from "@emotion/react/jsx-runtime";
import { decodeJwt } from "../../stores/AuthStore";
import { useMessageStore } from "../../stores/MessageStore";

const Announcement = (): JSX.Element => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [messageHistory, setMessageHistory] = useState<MessageInput[]>([]);
  const [message, setMessage] = useState<string>("");
  const { deleteMessage } = useMessageStore();
  const isTrainer = decodeJwt()?.isTrainer === true;
  const isAdmin = decodeJwt()?.isAdmin === true;

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
        roomApi
          .getMessages(1)
          .then((messages: MessageInput[]) => setMessageHistory(messages));
        client.subscribe("/topic/1/messages", (incomingMessage) => {
          console.log(incomingMessage.body);
          setMessageHistory((prev) => [
            ...prev,
            JSON.parse(incomingMessage.body),
          ]);
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

  const handleDeleteMessage = useCallback(
    async (messageId: number) => {
      await deleteMessage(messageId);
      setMessageHistory((prev) =>
        prev.filter((m) => m.messageId !== messageId),
      );
    },
    [deleteMessage],
  );

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
        mt: heightMinusTopNav,
        overflow: "hidden",
      }}
    >
      <MessagesDisplay
        connectionStatus={connectionStatus}
        messageHistory={messageHistory}
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
