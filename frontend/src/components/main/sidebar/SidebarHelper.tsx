import {
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import type { RoomType } from "../../../types/RoomType";
import { usePropStore } from "../../../stores/PropStore";
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "../../../stores/DocumentStore";
import { decodeJwt } from "../../../stores/AuthStore";

const SidebarHelper: React.FC<{
  items: string[];
  itemNames: string[];
  rooms?: RoomType[];
  activeView: string;
  setActiveView: (view: string) => void;
  select: string;
  setSelect: (selection: string) => void;
}> = ({
  items,
  itemNames,
  activeView,
  setActiveView,
  select,
  setSelect,
  rooms,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { setOpenSidebar, setRoomId, setNewDocModalOpen } = usePropStore();
  const navigate = useNavigate();
  const { documents, currentDocumentId, setCurrentDocumentId } =
    useDocumentStore();

  const selectionFilter = (item: string) => {
    if (activeView === item) return true;
    else if (select === item) return true;
    else return false;
  };

  return (
    <>
      {items.map((item, index) => (
        <ListItem key={item} disablePadding>
          <ListItemButton
            selected={selectionFilter(item)}
            onClick={() => {
              setSelect(item);
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
                  }
                } else {
                  if (isMobile) setOpenSidebar(false);
                  navigate("/" + item.toLowerCase());
                }
              } else {
                if (isMobile) setOpenSidebar(false);
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
