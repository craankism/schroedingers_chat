import type {JSX} from "@emotion/react/jsx-runtime";
import {Box, Button, IconButton, List, ListItem, Toolbar, Typography} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import {useEffect, useState} from "react";
import {useFileStore} from "../../stores/FileStore.ts";
import DeleteIcon from "@mui/icons-material/Delete";

const Files = (): JSX.Element => {
    const {files, uploadFile, getAllFilesMeta, downloadFile, deleteFile} = useFileStore();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        getAllFilesMeta();
    }, [getAllFilesMeta]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        uploadFile({file: selectedFile});
        setSelectedFile(null);
    };

    return (
        <Box component="main" sx={{flexGrow: 1, p: 3}}>
            <Toolbar/>
            <Typography variant="h5">Kursmaterialien</Typography>

            <Box sx={{maxWidth: 600, mx: "auto", mt: 4, p: 3}}>
                <Typography variant="h5" gutterBottom>
                    File Upload Test
                </Typography>

                <Box sx={{display: "flex", gap: 2, mb: 3}}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon/>}
                    >
                        Datei waehlen
                        <input type="file" hidden onChange={handleSelect}/>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        Hochladen
                    </Button>
                </Box>

                {selectedFile && (
                    <Typography variant="body2" sx={{mb: 2}}>
                        Gewaehlt: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </Typography>
                )}

                <List>
                    {files.map(f => (
                        <ListItem
                            key={f.fileId}
                            secondaryAction={
                                <>
                                    <IconButton onClick={() => downloadFile(f.fileId, f.filename)}>
                                        <DownloadIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => deleteFile(f.fileId)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </>
                            }
                        >
                            <Typography>{f.filename}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default Files;
