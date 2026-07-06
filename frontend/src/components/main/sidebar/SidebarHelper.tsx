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
  const { setOpenSidebar, setRoomId } = usePropStore();

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
              if (isMobile) setOpenSidebar(false);
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
