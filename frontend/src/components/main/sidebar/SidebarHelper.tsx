import {
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import type { RoomType } from "../../../types/RoomType";

const SidebarHelper: React.FC<{
  items: string[];
  itemNames: string[];
  rooms?: RoomType[];
  activeView: string;
  setActiveView: (view: string) => void;
  select: string;
  setSelect: (selection: string) => void;
  setRoomId: (roomId: number) => void;
  setOpen: (open: boolean) => void;
}> = ({
  items,
  itemNames,
  activeView,
  setActiveView,
  select,
  setSelect,
  setOpen,
  rooms,
  setRoomId,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
              if (itemNames.includes(item)) setActiveView(item);
              else {
                setActiveView("Chats");
              }
              if (isMobile) setOpen(false);
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
