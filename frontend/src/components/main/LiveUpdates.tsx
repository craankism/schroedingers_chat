import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useRoomStore } from "../../stores/RoomStore";
import { useUserStore } from "../../stores/UserStore";
import { useFileStore } from "../../stores/FileStore";

const LiveUpdates: React.FC = () => {
  const clientRef = useRef<Client | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");

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
        client.subscribe("/topic/updates", (incomingMessage) => {
          try {
            const event = JSON.parse(incomingMessage.body);
            if (event.type === "ROOM_UPDATE") {
              useRoomStore.getState().getRoom(event.id);
            } else if (event.type === "USER_UPDATE") {
              useUserStore.getState().getUser(event.id);
            } else if (event.type === "FILE_UPDATE") {
              useFileStore.getState().getFileMeta(event.id);
            }
          } catch {
            console.error("Failed to parse update event", incomingMessage.body);
          }
        });
      },
      onWebSocketClose: handleConnectionClose,
      onWebSocketError: handleConnectionClose,
      onStompError: handleConnectionClose,
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  console.log("LiveUpdates: " + connectionStatus);
};

export default LiveUpdates;
