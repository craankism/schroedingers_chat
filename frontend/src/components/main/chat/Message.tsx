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

    const selectFile = (event: SelectChangeEvent<string>) => {
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
        mr: { xs: 0, md: md },
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
            display: "flex",
            gap: 1,
        }}
    >
        {!announcement && (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "flex-start",
                }}
            >
                <Tooltip title={showAiHint ? "Hide AI hint" : "Show AI hint"}>
                    <IconButton
                        aria-label={showAiHint ? "Hide AI hint" : "Show AI hint"}
                        onClick={() => setShowAiHint((current) => !current)}
                        sx={{
                            borderRadius: "50%",
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
                                <MenuItem key={file.fileId} value={String(file.fileId)}>
                                    {file.filename}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </Tooltip>
            </Box>
        )}
        <Box
            sx={{
                flex: 1,
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {selectedFile && setSelectedFile && (
                <Chip
                    label={selectedFile.filename}
                    onDelete={() => setSelectedFile(null)}
                    size="small"
                    icon={<AttachFile />}
                    sx={{ mb: 1 }}
                />
            )}
        <TextField
          id="message"
          variant="outlined"
          multiline
          fullWidth
          sx={{
              flex: 1,
              maxHeight: 200,
              "& .MuiInputBase-root": {
                  height: "100%",
              },
          }}
          slotProps={{ input: { sx: { pb: 3 } } }}
          value={message}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setMessage(e.target.value);
            if (e.target.value.length > 4000) {
              setMessageTooLong(true);
            } else if (e.target.value.length <= 4000) {
              setMessageTooLong(false);
            }
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
      >
        Send
      </Button>
    </Box>
    </Box>
  );
};
export default Message;
