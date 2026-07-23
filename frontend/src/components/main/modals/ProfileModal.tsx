import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { decodeJwt } from "../../../stores/AuthStore.ts";
import { useUserStore } from "../../../stores/UserStore.ts";
import type { JSX } from "@emotion/react/jsx-runtime";
import { usePropStore } from "../../../stores/PropStore.ts";
import { useNotificationStore } from "../../../stores/NotificationStore.ts";
import ConfirmationModal from "./ConfirmationModal.tsx";
import { ThemeSwitcher } from "../ThemeSwitcher.tsx";
import { useProfilePictureStore } from "../../../stores/ProfilePictureStore.ts";
import { modalStyle } from "../../../types/constants/constants.ts";
import SMTPModal from "./SMTPModal.tsx";
import Cropper, { type Area } from "react-easy-crop";

const ProfileModal = (): JSX.Element => {
  const [displayName, setDisplayName] = React.useState<string>("");
  const [initialDisplayName, setInitialDisplayName] =
    React.useState<string>("");
  const [oldPassword, setOldPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [repeatNewPassword, setRepeatNewPassword] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isTrainer, setIsTrainer] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<number>(0);
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);

  const { updateUser, deleteUser, users } = useUserStore();
  const {
    openProfile,
    setOpenProfile,
    openConfirmation,
    setOpenConfirmation,
    confirmation,
    setConfirmation,
    smtpModalOpen,
    setSmtpModalOpen,
  } = usePropStore();
  const { uploadProfilePicture, profilePictures, deleteProfilePicture } =
    useProfilePictureStore();

  React.useEffect(() => {
    const user = users.find((user) => user.userId === decodeJwt()?.userId);
    if (user) {
      // eslint-disable-next-line
      setDisplayName(user.displayName);
      setInitialDisplayName(user.displayName);
      setEmail(user.email);
      setIsAdmin(user.isAdmin ?? false);
      setIsTrainer(user.isTrainer ?? false);
      setUserId(user.userId);
    }
    // eslint-disable-next-line
  }, []);

  const currentPicture = profilePictures.find((p) => p.userId === userId);

  const handleClose = () => setOpenProfile(false);

  const hasUpperCase = (password: string) => {
    return password !== password.toLowerCase();
  };
  const hasNumber = (password: string) => {
    return /\d/.test(password);
  };
  const submitHandler = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (displayName.length > 16) {
      useNotificationStore
        .getState()
        .addNotification("Username too long (max. 16 characters)", "error");
      return;
    }
    if (
      newPassword.length > 0 &&
      (!hasUpperCase(newPassword) ||
        !hasNumber(newPassword) ||
        newPassword.length < 8)
    ) {
      useNotificationStore
        .getState()
        .addNotification(
          "Password too weak. Need to be min. 8 digits, contain atleast 1 upper case letter and 1 number",
          "error",
        );
      return;
    }
    if (displayName === initialDisplayName && !newPassword) {
      setOpenProfile(false);
      return;
    }
    if (newPassword === repeatNewPassword) {
      const response = await updateUser(userId, {
        displayName,
        oldPassword,
        newPassword,
      });
      if (response) {
        setOpenProfile(false);
      }
    } else {
      useNotificationStore
        .getState()
        .addNotification("Passwords don't match", "error");
    }
  };

  React.useEffect(() => {
    if (confirmation && !showOverlay && openProfile) {
      deleteUser(userId);
      setOpenProfile(false);
      setConfirmation(false);
    }
    // eslint-disable-next-line
  }, [confirmation]);

  React.useEffect(() => {
    if (confirmation && showOverlay && currentPicture) {
      deleteProfilePicture(currentPicture.fileId);
      setConfirmation(false);
      // eslint-disable-next-line
      setShowOverlay(false);
    }
    // eslint-disable-next-line
  }, [confirmation]);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null,
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    // Reset input so selecting the same file again triggers onChange.
    e.target.value = "";
  };

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedImg = async (src: string, pixelCrop: Area): Promise<Blob> => {
    const image = new window.Image();
    image.src = src;
    await new Promise<void>((resolve) => {
      image.onload = () => resolve();
    });
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );
    return new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
        "image/jpeg",
      ),
    );
  };

  const handleUpload = async () => {
    if (!selectedFile || !imageSrc || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], selectedFile.name, {
      type: "image/jpeg",
    });
    uploadProfilePicture({ file: croppedFile });
    URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setSelectedFile(null);
    setShowOverlay(false);
  };

  const cancelCrop = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setSelectedFile(null);
  };

  return (
    <>
      <Modal
        open={openProfile}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
        }}
        onClick={() =>
          showOverlay && !openConfirmation && setShowOverlay(false)
        }
      >
        {imageSrc ? (
          <Box
            sx={{
              position: "relative",
              width: { xs: "90vw", sm: 600 },
              bgcolor: "background.paper",
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ position: "relative", height: { xs: "90vw", sm: 600 } }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{ p: 2, justifyContent: "flex-end" }}
            >
              <Button onClick={cancelCrop}>Cancel</Button>
              <Button variant="contained" onClick={handleUpload}>
                Confirm
              </Button>
            </Stack>
          </Box>
        ) : (
          <form onSubmit={submitHandler}>
            <Box
              sx={{
                ...modalStyle,
                maxHeight: "calc(100vh - 32px)",
                overflowY: "auto",
              }}
            >
              <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                <Grid
                  size={{ xs: 12, md: 4 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: { xs: 0, md: 1 },
                      minHeight: { xs: 120, md: "auto" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: { xs: "40%", md: "100%" },
                        aspectRatio: "1",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "block",
                        "& .pp-overlay-top": { opacity: showOverlay ? 1 : 0 },
                        "& .pp-overlay-bottom": {
                          opacity: showOverlay ? 1 : 0,
                        },
                      }}
                    >
                      <input
                        id="pp-file-input"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleSelect}
                      />
                      <Avatar
                        alt="profile picture"
                        src={currentPicture?.url ?? ""}
                        sx={{ width: "100%", height: "100%" }}
                      />
                      {/* Top half — upload */}
                      <Box
                        className="pp-overlay-top"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "50%",
                          bgcolor: "rgba(0,0,0,0.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOverlay(true);
                          if (showOverlay) {
                            document.getElementById("pp-file-input")?.click();
                          }
                        }}
                      >
                        <EditIcon
                          sx={{ color: "white", fontSize: 28 }}
                          onClick={() => {
                            setShowOverlay(true);
                          }}
                        />
                      </Box>
                      {/* Bottom half — delete */}
                      <Box
                        className="pp-overlay-bottom"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOverlay(true);
                          if (showOverlay && currentPicture) {
                            setOpenConfirmation(true);
                          }
                        }}
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "50%",
                          bgcolor: "rgba(180,0,0,0.55)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s",
                          cursor: currentPicture ? "pointer" : "default",
                        }}
                      >
                        <DeleteIcon
                          sx={{ color: "white", fontSize: 28 }}
                          onClick={() => {
                            setShowOverlay(true);
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      justifyContent: "center",
                      pb: 1,
                    }}
                  >
                    {userId === 1 && (
                      <Button
                        onClick={() => {
                          setSmtpModalOpen(!smtpModalOpen);
                        }}
                      >
                        SMTP Config
                      </Button>
                    )}
                    <ThemeSwitcher />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Profile:
                    </Typography>
                    <TextField
                      type="text"
                      label="Username"
                      variant="outlined"
                      fullWidth
                      required
                      value={displayName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDisplayName(e.target.value)
                      }
                    />
                    <TextField
                      type="password"
                      label="Old Password"
                      variant="outlined"
                      fullWidth
                      required={
                        displayName !== initialDisplayName ||
                        newPassword.length > 0
                      }
                      value={oldPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setOldPassword(e.target.value)
                      }
                    />
                    <TextField
                      type="password"
                      label="New Password"
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPassword(e.target.value)
                      }
                    />
                    <TextField
                      type="password"
                      label="Repeat New Password"
                      variant="outlined"
                      fullWidth
                      required={newPassword != ""}
                      value={repeatNewPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setRepeatNewPassword(e.target.value)
                      }
                    />
                    <TextField
                      type="email"
                      label="E-Mail"
                      variant="outlined"
                      disabled
                      fullWidth
                      value={email}
                    />
                    <FormControlLabel
                      disabled
                      control={<Checkbox checked={isTrainer} />}
                      label="Trainer"
                    />
                    <FormControlLabel
                      disabled
                      control={<Checkbox checked={isAdmin} />}
                      label="Admin"
                    />
                    <Button
                      onClick={() => setOpenConfirmation(true)}
                      sx={{
                        borderColor: "error.main",
                        backgroundColor: "error.main",
                        color: "error.contrastText",
                        "&:hover": {
                          backgroundColor: "error.dark",
                          borderColor: "error.dark",
                        },
                      }}
                    >
                      Delete Account
                    </Button>
                    <Button onClick={() => setOpenProfile(false)}>Back</Button>
                    <Button type="submit">Save</Button>
                    <ConfirmationModal />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </form>
        )}
      </Modal>
      <SMTPModal />
    </>
  );
};

export default ProfileModal;
