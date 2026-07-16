import {Box, Button, TextField, Typography, Tooltip, IconButton, MenuItem, Select, type SelectChangeEvent, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { widthMinusSidebar } from "../../../types/constants/constants";
import { AttachFile, InfoOutlined } from "@mui/icons-material";
import { useFileStore } from "../../../stores/FileStore.ts";
import type { FileType } from "../../../types/FileType.ts";

type MessageProps = {
  message: string;
  setMessage(message: string): void;
  handleClickSendMessage(): void;
  isConnected: boolean;
  announcement: boolean;
  selectedFile?: FileType | null;
  setSelectedFile?: (file: FileType | null) => void;
};

const Message: React.FC<MessageProps> = ({
  message,
  setMessage,
  handleClickSendMessage,
  isConnected,
  announcement,
  selectedFile,
  setSelectedFile,
}) => {
  const [messageTooLong, setMessageTooLong] = useState<boolean>(false);
  const [showAiHint, setShowAiHint] = useState<boolean>(true);
  const { files, getAllFilesMeta } = useFileStore();
  let md = 30;
  if (announcement) {
    md = 0;
  }

  useEffect(() => {
      if (!announcement) {
          getAllFilesMeta();
      }
  }, [announcement, getAllFilesMeta]);

    const selectFile = (event: SelectChangeEvent) => {
        const file = files.find(
            (item) => item.fileId === Number(event.target.value),
        );

        setSelectedFile?.(file ?? null);
    };

    return (
        <Box
            sx={{
                p: 1,
                bgcolor: "background.paper",
                ml: widthMinusSidebar,
                mr: { xs: 0, md },
            }}
        >
            {!announcement && showAiHint && (
                <Box
                    sx={{
                        mb: 1,
                        px: 1.5,
                        py: 1,
                        borderRadius: 1,
                        bgcolor: "action.hover",
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Ask our Artificial Meowligence 🐈‍⬛ with <Box component="strong">@void</Box> · Use the paperclip to add a file reference for Void
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr)",
                    columnGap: 1,
                    rowGap: 1,
                }}
            >
                {!announcement && (
                    <Box
                        sx={{
                            gridColumn: 1,
                            gridRow: 2,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Tooltip title={showAiHint ? "Hide AI hint" : "Show AI hint"}>
                            <IconButton
                                aria-label={showAiHint ? "Hide AI hint" : "Show AI hint"}
                                onClick={() => setShowAiHint((current) => !current)}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "transparent",
                                    },
                                }}
                            >
                                <InfoOutlined />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Add AI file reference" placement="right">
                            <Select
                                value={selectedFile ? String(selectedFile.fileId) : ""}
                                displayEmpty
                                onChange={selectFile}
                                IconComponent={() => null}
                                renderValue={() => <AttachFile fontSize="small" />}
                                inputProps={{
                                    "aria-label": "Add AI file reference",
                                }}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",

                                    "& fieldset": {
                                        border: "none",
                                    },

                                    "& .MuiSelect-select": {
                                        width: "100%",
                                        height: "100%",
                                        padding: "0 !important",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    },
                                }}
                            >
                                {files.length === 0 ? (
                                    <MenuItem disabled value="">
                                        No files available
                                    </MenuItem>
                                ) : (
                                    files.map((file) => (
                                        <MenuItem
                                            key={file.fileId}
                                            value={String(file.fileId)}
                                        >
                                            {file.filename}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </Tooltip>
                    </Box>
                )}

                {selectedFile && (
                    <Chip
                        label={selectedFile.filename}
                        onDelete={
                            setSelectedFile
                                ? () => setSelectedFile(null)
                                : undefined
                        }
                        size="small"
                        icon={<AttachFile />}
                        sx={{
                            gridColumn: 2,
                            gridRow: 1,
                            alignSelf: "flex-start",
                            maxWidth: "100%",
                        }}
                    />
                )}

                <Box
                    sx={{
                        gridColumn: 2,
                        gridRow: 2,
                        minWidth: 0,
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            position: "relative",
                            display: "flex",
                        }}
                    >
                        <TextField
                            id="message"
                            variant="outlined"
                            multiline
                            sx={{
                                flex: 1,
                                maxHeight: 200,
                                "& .MuiInputBase-root": {
                                    height: "100%",
                                },
                            }}
                            slotProps={{
                                input: {
                                    sx: {
                                        py: 3,
                                    },
                                },
                            }}
                            value={message}
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >,
                            ) => {
                                setMessage(e.target.value);
                                setMessageTooLong(e.target.value.length > 4000);
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    !e.shiftKey &&
                                    isConnected &&
                                    !messageTooLong
                                ) {
                                    e.preventDefault();
                                    handleClickSendMessage();
                                }
                            }}
                        />

                        <Typography
                            sx={{
                                position: "absolute",
                                bottom: 8,
                                right: 12,
                                fontSize: "0.75rem",
                                color: "text.secondary",
                                pointerEvents: "none",
                            }}
                        >
                            {message.length}/4000
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleClickSendMessage}
                        disabled={!isConnected || messageTooLong}
                        sx={{
                            flexShrink: 0,
                            minWidth: { xs: 72, sm: 88 },
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
export default Message;
