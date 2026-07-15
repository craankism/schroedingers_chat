import { Client } from "@stomp/stompjs";
import { Box } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessagesDisplay from "../main/chat/MessagesDisplay";
import Message from "../main/chat/Message";
import type { MessageInput, MessageType } from "../../types/MessageType";
import MemberSidebar from "../main/chat/MemberSidebar";
import { useMessageStore } from "../../stores/MessageStore";
import { decodeJwt } from "../../stores/AuthStore.ts";
import ICQSound from "../../assets/ICQSound.mp3";

type ChatProps = {
  roomId: number;
};

const containsVoidMention = (
    content: string
): boolean => {
    return /@void/i.test(content ?? "");
};

const isMessageFromVoid = (
    message: MessageInput,
): boolean => {
    return message.sender.trim() === "Void 🐈‍⬛"
};

const VOID_TIMEOUT = 2 * 60 * 1000;

const Chat: React.FC<ChatProps> = (roomId) => {
  const clientRef = useRef<Client | null>(null);
  const voidTimeoutRefs = useRef<Map<number, number>>(new Map());
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [message, setMessage] = useState<string>("");
  const [pendingVoidPromptIds, setPendingVoidPromptIds] = useState<Set<number>>(new Set());
  const isVoidThinking = pendingVoidPromptIds.size > 0;
  const { setMessages, markMessageDeleted, getMessages } = useMessageStore();

    const startVoidThinking = useCallback((promptMessageId: number) => {
        setPendingVoidPromptIds((currentIds) => {
            if (currentIds.has(promptMessageId)) {
                return currentIds;
            }

            const nextIds = new Set(currentIds);
            nextIds.add(promptMessageId);

            return nextIds;
        });

        const existingTimeout =
            voidTimeoutRefs.current.get(promptMessageId);

        if (existingTimeout !== undefined) {
            window.clearTimeout(existingTimeout);
        }

        const timeoutId = window.setTimeout(() => {
            voidTimeoutRefs.current.delete(promptMessageId);

            setPendingVoidPromptIds((currentIds) => {
                const nextIds = new Set(currentIds);
                nextIds.delete(promptMessageId);

                return nextIds;
            });

            console.error(`Void did not respond to prompt ${promptMessageId} in time`);
        }, VOID_TIMEOUT);

        voidTimeoutRefs.current.set(promptMessageId, timeoutId);
    }, []);

    const stopVoidThinking = useCallback(
        (promptMessageId: number) => {
            const timeoutId =
                voidTimeoutRefs.current.get(promptMessageId);

            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
                voidTimeoutRefs.current.delete(promptMessageId);
            }

            setPendingVoidPromptIds((currentIds) => {
                if (!currentIds.has(promptMessageId)) {
                    return currentIds;
                }

                const nextIds = new Set(currentIds);
                nextIds.delete(promptMessageId);

                return nextIds;
            });
        },
        [],
    );

    const clearVoidThinking = useCallback(() => {
        voidTimeoutRefs.current.forEach((timeoutId) => {
            window.clearTimeout(timeoutId);
        });

        voidTimeoutRefs.current.clear();
        setPendingVoidPromptIds(new Set());
    }, []);

  const getWsUrl = () => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    return `${protocol}://${host}/ws`;
  };

  useEffect(() => {
    const handleConnectionClose = () => {
        setConnectionStatus("Closed");
        clearVoidThinking();
    };

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
              const receivedMessage = JSON.parse(incomingMessage.body);
              setMessages(receivedMessage);

              if (isMessageFromVoid(receivedMessage)) {
                  if (receivedMessage.promptMessageId != null) {
                      stopVoidThinking(receivedMessage.promptMessageId);
                  }
              } else if (containsVoidMention(receivedMessage.content)) {
                  startVoidThinking(receivedMessage.messageId);
              }

              if (receivedMessage.userId !== decodeJwt()?.userId) {
                  new Audio(ICQSound).play();
              }
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
        clearVoidThinking();
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
      const content = message.trim();

      if (!content || !clientRef.current?.connected) {
          return;
      }

      try {
          clientRef.current.publish({
              destination: "/app/chat/" + roomId.roomId,
              body: JSON.stringify({
                  content: message,
              } as MessageType),
          });
          setMessage("");
      } catch (error) {
          console.error("Error sending message:", error);
      }
  }, [message, roomId]);

  const isConnected = connectionStatus === "Open";

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <MessagesDisplay
        connectionStatus={connectionStatus}
        handleDeleteMessage={handleDeleteMessage}
        announcement={false}
        isVoidThinking={isVoidThinking}
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
