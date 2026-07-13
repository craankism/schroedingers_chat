import { Client } from "@stomp/stompjs";
import { Box } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessagesDisplay from "../main/chat/MessagesDisplay";
import Message from "../main/chat/Message";
import type { MessageType } from "../../types/MessageType";
import MemberSidebar from "../main/chat/MemberSidebar";
import { useMessageStore } from "../../stores/MessageStore";

type ChatProps = {
  roomId: number;
};

const Chat: React.FC<ChatProps> = (roomId) => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [message, setMessage] = useState<string>("");
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
        getMessages(roomId.roomId);
        client.subscribe(
          "/topic/" + roomId.roomId + "/messages",
          (incomingMessage) => {
            setMessages(JSON.parse(incomingMessage.body));
          },
        );

        client.subscribe(
          "/topic/" + roomId.roomId + "/delete",
          (incomingMessage) => {
            const deletedMessage = JSON.parse(incomingMessage.body) as {
              messageId: number;
            };
            markMessageDeleted(deletedMessage.messageId);
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
    // eslint-disable-next-line
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
    if (!message.trim() || !clientRef.current?.connected) {
      return;
    }

    clientRef.current.publish({
      destination: "/app/chat/" + roomId.roomId,
      body: JSON.stringify({
        content: message,
      } as MessageType),
    });
    setMessage("");
  }, [message, roomId]);

  const isConnected = connectionStatus === "Open";

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <MessagesDisplay
        connectionStatus={connectionStatus}
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
