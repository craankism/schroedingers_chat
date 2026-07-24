import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, TextField } from "@mui/material";
import { useFolderStore } from "../../../stores/FolderStore.ts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90vw", md: 800 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type NewFolderModalProps = {
  openFolderModal: boolean;
  setOpenFolderModal: (open: boolean) => void;
  setFolderSelect: (folderId: number) => void;
};

const NewFolderModal: React.FC<NewFolderModalProps> = ({
  openFolderModal,
  setOpenFolderModal,
  setFolderSelect,
}) => {
  const [name, setName] = React.useState<string>("");
  const { createFolder } = useFolderStore();

  const handleClose = () => {
    setOpenFolderModal(false);
  };

  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const storedFolder = localStorage.getItem("selectedFolder");
    const folder = await createFolder({
      name,
      parentFolderId:
        storedFolder && storedFolder !== "null" ? Number(storedFolder) : null,
    });
    if (folder) {
      setFolderSelect(folder.folderId);
      localStorage.setItem("selectedFolder", String(folder.folderId));
    }
    setName("");
    handleClose();
  };

  return (
    <div>
      <Modal
        open={openFolderModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onClick={(e) => e.stopPropagation()}>
          <form onSubmit={submitHandler}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={12}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Folder:
                </Typography>
              </Grid>
              <Grid size={12}>
                <TextField
                  id="docName"
                  type="text"
                  label="Name"
                  required
                  fullWidth
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                />
              </Grid>
              <Grid size={12}>
                <Button type="submit">Create</Button>
                <Button sx={{ ml: 1 }} onClick={handleClose}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default NewFolderModal;
