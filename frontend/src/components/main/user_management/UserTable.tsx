import { DataGrid } from "@mui/x-data-grid";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useUserStore } from "../../../stores/UserStore";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid";

const UserTable = (): JSX.Element => {
  const { getAllUsers, deleteUser, users, updateUserRoles } = useUserStore();

  const handleRowUpdate = async (
    updatedRow: GridRowModel,
    originalRow: GridRowModel,
  ): Promise<GridRowModel> => {
    if (updatedRow.admin !== originalRow.admin) {
      await updateUserRoles(updatedRow.userId, "setAdmin");
    } else if (updatedRow.trainer !== originalRow.trainer) {
      await updateUserRoles(updatedRow.userId, "setTrainer");
    } else if (updatedRow.active !== originalRow.active) {
      await updateUserRoles(updatedRow.userId, "setActive");
    }
    return updatedRow;
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", minWidth: 70, flex: 0.5 },
    { field: "email", headerName: "E-Mail", minWidth: 220, flex: 1.8 },
    {
      field: "displayName",
      headerName: "Display Name",
      minWidth: 160,
      flex: 1.2,
    },
    {
      field: "admin",
      headerName: "Admin",
      type: "boolean",
      editable: true,
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "trainer",
      headerName: "Trainer",
      type: "boolean",
      editable: true,
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "active",
      headerName: "Aktiv",
      type: "boolean",
      editable: true,
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "delete",
      headerName: "Löschen",
      type: "boolean",
      minWidth: 110,
      flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          onClick={() => deleteUser(params.row.userId)}
          sx={{ border: "none", boxShadow: "none" }}
        >
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Box sx={{ height: 630, maxWidth: { xs: "90vw", md: "100vw" }, mt: 1 }}>
      <DataGrid
        rows={users}
        getRowId={(row) => row.userId}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20, 30]}
        processRowUpdate={handleRowUpdate}
        sx={{ border: 0 }}
      />
    </Box>
  );
};

export default UserTable;
