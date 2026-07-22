import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import type { RoomType } from "../../../types/RoomType";
import { usePropStore } from "../../../stores/PropStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useDocumentStore } from "../../../stores/DocumentStore";
import { decodeJwt } from "../../../stores/AuthStore";

const SidebarHelper: React.FC<{
  items: string[];
  itemNames: string[];
  rooms?: RoomType[];
  activeView: string;
  setActiveView: (view: string) => void;
}> = ({ items, itemNames, activeView, setActiveView, rooms }) => {
  const { setOpenSidebar, setRoomId, setNewDocModalOpen, roomId } =
    usePropStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { documents, currentDocumentId, setCurrentDocumentId } =
    useDocumentStore();

  const selectionFilter = (item: string) => {
    if (location.pathname === "/" && item === "Announcement") {
      return true;
    }
    if (itemNames.includes(item)) {
      // Named view items: prefer URL path match, fall back to activeView state
      return (
        location.pathname === "/" + item.toLowerCase() || activeView === item
      );
    } else {
      // Room items: match by roomId so new rooms and page reloads are handled correctly
      return (
        rooms?.find((r) => r.name === item)?.roomId === roomId &&
        location.pathname === "/chat"
      );
    }
  };

  return (
    <>
      {items.map((item, index) => (
        <ListItem
          key={item + rooms?.find((room) => roomId === room.roomId)?.roomId}
          disablePadding
        >
          <ListItemButton
            selected={selectionFilter(item)}
            onClick={() => {
              if (rooms) setRoomId(rooms.at(index)?.roomId || 0);
              if (itemNames.includes(item)) {
                setActiveView(item);
                if (item === "Editor") {
                  const currentUserId = decodeJwt()?.userId;
                  const memberDocs = documents.filter((document) =>
                    document.documentMembershipList.some(
                      (userId: number) => userId === currentUserId,
                    ),
                  );

                  if (memberDocs.length === 0) {
                    setNewDocModalOpen(true);
                  } else {
                    // Prefer the current document id when valid, otherwise use the first member doc.
                    const currentMemberDocument = memberDocs.find(
                      (document) => document.documentId === currentDocumentId,
                    );
                    const selectedDocumentId =
                      currentMemberDocument?.documentId ??
                      memberDocs[0].documentId ??
                      0;

                    setCurrentDocumentId(selectedDocumentId);
                    navigate("/" + item.toLowerCase());
                    setOpenSidebar(false);
                  }
                } else {
                  setOpenSidebar(false);
                  navigate("/" + item.toLowerCase());
                }
              } else {
                setOpenSidebar(false);
                navigate("/chat");
                setActiveView("Chats");
              }
            }}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default SidebarHelper;
