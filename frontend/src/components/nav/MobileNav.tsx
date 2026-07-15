import { Box, Typography, Menu, MenuItem, Divider, useTheme } from "@mui/material";
import IconSC from "../../assets/iconSC.png";
import { Menu as MenuIcon } from "@mui/icons-material";
import type { JSX } from "@emotion/react/jsx-runtime";
import { usePropStore } from "../../stores/PropStore";
import { useAuthStore } from "../../stores/AuthStore";
import { useDocumentStore } from "../../stores/DocumentStore";
import { decodeJwt } from "../../stores/AuthStore";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MobileNav = (): JSX.Element => {
    const theme = useTheme();
    const { openSidebar, setOpenSidebar } = usePropStore();
    const { isAuthenticated } = useAuthStore();
    const { documents, getAllDocuments, setCurrentDocumentId, currentDocumentId } = useDocumentStore();
    const [fileAnchor, setFileAnchor] = useState<HTMLElement | null>(null);
    const location = useLocation();
    const {setNewDocModalOpen} = usePropStore();

    const isInEditorView = location.pathname === "/editor" || location.pathname.startsWith("/editor");

    useEffect(() => {
        if (isInEditorView) {
            getAllDocuments();
        }
    }, [isInEditorView, getAllDocuments]);

    const myJwt = decodeJwt();
    const userDocs = documents.filter((doc) =>
        doc.documentMembershipList.includes(myJwt?.userId || 0)
    );

    return (
        <>
            <Box
                sx={{
                    display: { xs: "flex", md: "none" },
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {isInEditorView && (
                    <Typography
                        variant="body2"
                        onClick={(e) => setFileAnchor(e.currentTarget)}
                        sx={{
                            position: "fixed",
                            left: 16,
                            top: 14,
                            cursor: "pointer",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                            px: 1.5,
                            py: 0.5,
                            border: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            userSelect: "none",
                            "&:hover": {
                                borderColor: theme.palette.primary.light,
                                backgroundColor: theme.palette.background.paper,
                            },
                        }}
                    >
                        File
                    </Typography>
                )}

                <Box
                    component="img"
                    src={IconSC}
                    sx={{
                        mr: 1,
                        mb: 1,
                        height: 40,
                    }}
                />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                        mr: 2,
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 700,
                        letterSpacing: ".3rem",
                        color: theme.palette.text.primary,
                        textDecoration: "none",
                        alignSelf: "center",
                    }}
                >
                    SC
                </Typography>
                <Box
                    sx={{
                        display: isAuthenticated ? "flex" : "none",
                        position: "fixed",
                        right: 20,
                        scale: 2,
                        cursor: "pointer",
                    }}
                    onClick={() => setOpenSidebar(!openSidebar)}
                >
                    <MenuIcon color="primary" />
                </Box>
            </Box>

            <Menu
                disableScrollLock
                anchorEl={fileAnchor}
                open={!!fileAnchor}
                onClose={() => setFileAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <MenuItem
                    onClick={() => {
                        setNewDocModalOpen(true);
                        setFileAnchor(null);
                    }}
                >
                    New File
                </MenuItem>
                <Divider />
                {userDocs.map((document) => (
                    <MenuItem
                        key={document.documentId}
                        selected={document.documentId === currentDocumentId}
                        onClick={() => {
                            setCurrentDocumentId(document.documentId || 0);
                            setFileAnchor(null);
                        }}
                    >
                        {document.title}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default MobileNav;