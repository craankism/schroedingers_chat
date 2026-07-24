import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { JSX } from "@emotion/react/jsx-runtime";
import { Button, Toolbar } from "@mui/material";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid";
import { useRoomStore } from "../../stores/RoomStore";
import { widthMinusSidebar } from "../../types/constants/constants";

const RoomManagement = (): JSX.Element => {
  const { deleteRoom, rooms, updateRoom } = useRoomStore();

  const handleRowUpdate = (
    updatedRow: GridRowModel,
    originalRow: GridRowModel,
  ): GridRowModel => {
    updateRoom(
      { name: updatedRow.name, userIdSet: updatedRow.userList },
      originalRow.roomId,
    );
    return updatedRow;
  };

  const columns: GridColDef[] = [
    { field: "roomId", headerName: "ID", minWidth: 70, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 220,
      flex: 1.8,
      editable: true,
    },
    {
      field: "createdBy",
      headerName: "Created by ID",
      minWidth: 70,
      flex: 1,
    },
    {
      field: "userList",
      headerName: "User IDs",
      editable: true,
      type: "multiSelect",
      minWidth: 100,
      flex: 1.5,
    },
    {
      field: "delete",
      headerName: "Delete",
      type: "boolean",
      minWidth: 110,
      flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          onClick={() => deleteRoom(params.row.roomId)}
          sx={{ border: "none", boxShadow: "none" }}
        >
          <GridDeleteIcon />
        </Button>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, ml: widthMinusSidebar }}>
      <Toolbar />
      <Typography variant="h5">Room Management</Typography>
      <Box sx={{ height: 630, maxWidth: { xs: "90vw", md: "100vw" }, mt: 1 }}>
        <DataGrid
          rows={rooms}
          getRowId={(row) => row.roomId}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20, 30]}
          processRowUpdate={handleRowUpdate}
          sx={{ border: 0 }}
        />
      </Box>
    </Box>
  );
};

export default RoomManagement;
