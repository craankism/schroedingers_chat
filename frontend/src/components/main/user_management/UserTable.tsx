import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useUserStore } from "../../../stores/UserStore";
import { useEffect } from "react";

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 70 },
  { field: "email", headerName: "E-Mail", width: 160 },
  { field: "displayName", headerName: "Display Name", width: 130 },
  {
    field: "isAdmin",
    headerName: "Admin",
    type: "boolean",
    width: 90,
  },
  {
    field: "isTrainer",
    headerName: "Trainer",
    type: "boolean",
    width: 160,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

const UserTable = (): JSX.Element => {
  const { getAllUsers, users } = useUserStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default UserTable;
