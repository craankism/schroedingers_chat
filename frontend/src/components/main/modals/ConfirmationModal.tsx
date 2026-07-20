import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import React from "react";
import { usePropStore } from "../../../stores/PropStore.ts";
import type { JSX } from "@emotion/react/jsx-runtime";
import {modalStyle} from "../../../types/constants/constants.ts";

const ConfirmationModal = (): JSX.Element => {
  const { setOpenConfirmation, openConfirmation, setConfirmation } =
    usePropStore();

  const handleClose = () => {
    setOpenConfirmation(false);
  };

  return (
    <React.Fragment>
      <Modal
        open={openConfirmation}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...modalStyle, width: 230, height: 150 }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={12}>
              <Typography variant="h6">Are you Sure?</Typography>
            </Grid>
            <Grid size={12}>
              <Button
                onClick={() => {
                  setConfirmation(true);
                  handleClose();
                }}
                sx={{ mr: 3, borderColor: "red", backgroundColor: "#ff000088" }}
              >
                YES
              </Button>
              <Button onClick={handleClose}>NO</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default ConfirmationModal;
