import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import { Typography } from "@mui/material";
import NewRoomModal from "../sidebar/NewRoomModal";
import { useRoomStore } from "../../../stores/RoomStore";
import { decodeJwt } from "../../../stores/AuthStore";
import { usePropStore } from "../../../stores/PropStore";

type EditChatProps = {
  roomId: number;
};

const EditChat: React.FC<EditChatProps> = (roomId) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [creator, setCreator] = React.useState<boolean>(false);
  const [edit, setEdit] = React.useState<boolean>(true);
  const { deleteRoom, getRoom } = useRoomStore();
  const { setRoomId } = usePropStore();
  const open = Boolean(anchorEl);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openModalFunc = () => {
    setOpenModal(!openModal);
  };

  const roomCreatorHandle = async () => {
    const room = await getRoom(roomId.roomId);
    if (room) {
      setCreator(room.createdBy == decodeJwt()?.userId);
    }
  };

  //   React.useEffect(() => {
  //     // eslint-disable-next-line
  //     roomCreatorHandle();
  //   }, [roomId.roomId]);

  const roomEditHandle = (addUser: boolean) => {
    if (addUser) setEdit(true);
    else setEdit(false);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            roomCreatorHandle();
            handleClick(event);
          }}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open}
          sx={{
            display: roomId.roomId === 2 || roomId.roomId === 3 ? "none" : "inline-flex",
          }}
        >
          <MoreVert sx={{ width: 32, height: 32 }} />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            openModalFunc();
            roomEditHandle(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          Add Members
        </MenuItem>
        <MenuItem
          onClick={() => {
            openModalFunc();
            roomEditHandle(false);
            handleClose();
          }}
          disabled={!creator}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Change Roomname
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteRoom(roomId.roomId);
            setRoomId(2);
            handleClose();
          }}
          disabled={!creator}
        >
          <ListItemIcon>
            <Delete sx={{ color: "red" }} fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ color: "red" }}>Delete Room</Typography>
        </MenuItem>
      </Menu>
      <NewRoomModal
        openModal={openModal}
        closeModal={setOpenModal}
        roomEdit={edit}
        roomId={roomId.roomId}
      />
    </React.Fragment>
  );
};

export default EditChat;
