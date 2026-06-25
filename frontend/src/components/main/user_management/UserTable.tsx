import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useUserStore } from "../../../stores/UserStore";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
} from "@mui/x-data-grid";

const UserTable = (): JSX.Element => {
  const { getAllUsers, deleteUser, users, updateUser } = useUserStore();

  const handleRowUpdate = async (
    updatedRow: GridRowModel,
    originalRow: GridRowModel,
  ): Promise<GridRowModel> => {
    if (updatedRow.admin !== originalRow.admin) {
      await updateUser(updatedRow.userId, "setAdmin");
    } else if (updatedRow.trainer !== originalRow.trainer) {
      await updateUser(updatedRow.userId, "setTrainer");
    } else if (updatedRow.active !== originalRow.active) {
      await updateUser(updatedRow.userId, "setActive");
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

  // const test = [{
  //   id: 1,
  //   userId: 1,
  //   email: "sa@xd.de",
  //   displayName: "Craankism",
  //   isAdmin: false,
  //   isTrainer: false,
  //   isActive: false,
  // }];

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        getRowId={(row) => row.userId}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20, 30]}
        processRowUpdate={handleRowUpdate}
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default UserTable;
