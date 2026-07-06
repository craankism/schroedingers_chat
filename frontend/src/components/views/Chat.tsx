import { Client } from "@stomp/stompjs";
import { Box } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessagesDisplay from "../main/chat/MessagesDisplay";
import Message from "../main/chat/Message";
import { heightMinusTopNav } from "../../types/constants/constants";
import type { MessageInput, MessageType } from "../../types/MessageType";
import { roomApi } from "../../services/apiCalls";
import MemberSidebar from "../main/chat/MemberSidebar";

type ChatProps = {
  roomId: number;
};

const Chat: React.FC<ChatProps> = (roomId) => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [messageHistory, setMessageHistory] = useState<MessageInput[]>([]);
  const [message, setMessage] = useState<string>("");

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
          .getMessages(roomId.roomId)
          .then((messages) => setMessageHistory(messages));
        client.subscribe(
          "/topic/" + roomId.roomId + "/messages",
          (incomingMessage) => {
            console.log(incomingMessage.body);
            setMessageHistory((prev) => [
              ...prev,
              JSON.parse(incomingMessage.body),
            ]);
          },
        );
        client.subscribe(
          "/topic/" + roomId.roomId + "/delete",
          (incomingMessage) => {
            const { messageId } = JSON.parse(incomingMessage.body) as {
              messageId: number;
            };
            setMessageHistory((prev) =>
              prev.filter((m) => m.messageId !== messageId),
            );
          },
        );
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
  }, [roomId.roomId]);

  const handleDeleteMessage = useCallback(
    (messageId: number) => {
      if (!clientRef.current?.connected) {
        return;
      }
      clientRef.current.publish({
        destination: "/app/chat/" + roomId.roomId + "/delete",
        body: JSON.stringify({ messageId }),
      });
    },
    [roomId],
  );

  const handleClickSendMessage = useCallback(() => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !clientRef.current?.connected) {
      return;
    }

    clientRef.current.publish({
      destination: "/app/chat/" + roomId.roomId,
      body: JSON.stringify({
        content: trimmedMessage,
      } as MessageType),
    });
    setMessage("");
  }, [message, roomId]);

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
        announcement={false}
      />
      <MemberSidebar roomId={roomId.roomId} />
      <Message
        message={message}
        setMessage={setMessage}
        handleClickSendMessage={handleClickSendMessage}
        isConnected={isConnected}
        announcement={false}
      />
    </Box>
  );
};

export default Chat;
