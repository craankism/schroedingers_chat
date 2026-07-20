"use client";

import {useContext, useEffect, useRef, useState} from "react";
import {EditorContent, EditorContext, useEditor} from "@tiptap/react";
import {useTheme} from "@mui/material/styles";
import {Box, Divider, IconButton, ListItemText, Popover, useMediaQuery} from "@mui/material";

// --- Tiptap Core Extensions ---
import {StarterKit} from "@tiptap/starter-kit";
import {Image} from "@tiptap/extension-image";
import {TaskItem, TaskList} from "@tiptap/extension-list";
import {TextAlign} from "@tiptap/extension-text-align";
import {Typography} from "@tiptap/extension-typography";
import {Highlight} from "@tiptap/extension-highlight";
import {Subscript} from "@tiptap/extension-subscript";
import {Superscript} from "@tiptap/extension-superscript";
import {Selection} from "@tiptap/extensions";

// --- UI Primitives ---
import {Button} from "@/components/tiptap-ui-primitive/button";
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import {HorizontalRule} from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension.ts";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import {HeadingDropdownMenu} from "@/components/tiptap-ui/heading-dropdown-menu";
import {ListDropdownMenu} from "@/components/tiptap-ui/list-dropdown-menu";
import {BlockquoteButton} from "@/components/tiptap-ui/blockquote-button";
import {CodeBlockButton} from "@/components/tiptap-ui/code-block-button";
import {
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover";
import {MarkButton} from "@/components/tiptap-ui/mark-button";
import {TextAlignButton} from "@/components/tiptap-ui/text-align-button";
import {UndoRedoButton} from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import {ArrowLeftIcon} from "@/components/tiptap-icons/arrow-left-icon.tsx";
import {HighlighterIcon} from "@/components/tiptap-icons/highlighter-icon.tsx";
import {LinkIcon} from "@/components/tiptap-icons/link-icon.tsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// --- Hooks ---
import {useIsBreakpoint} from "@/hooks/use-is-breakpoint.ts";

// --- Styles ---
import "./SimpleEditor.scss";

// mine
import {useHocuspocusProvider} from "@hocuspocus/provider-react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom,
} from "@hocuspocus/provider-react";
import {decodeJwt} from "../../../stores/AuthStore.ts";
import {Paper} from "@mui/material";
import {useDocumentStore} from "../../../stores/DocumentStore.ts";
import MenuItem from "@mui/material/MenuItem";
import {usePropStore} from "../../../stores/PropStore.ts";
import Menu from "@mui/material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {useFolderStore} from "../../../stores/FolderStore.ts";
import {useFileStore} from "../../../stores/FileStore.ts";
import {useNotificationStore} from "../../../stores/NotificationStore.ts";
import type {FolderInput} from "../../../types/FolderType.ts";
import {createMarkdownFile} from "../../../services/exportDocument.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import DownloadIcon from "@mui/icons-material/Download";
import ConfirmationModal from "../../main/modals/ConfirmationModal.tsx";

const MainToolbarContent = () => {
    const editorContext = useContext(EditorContext);
    const editor = editorContext?.editor;

    const { setConfirmation, setOpenConfirmation, confirmation } = usePropStore();
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [pendingDeleteTitle, setPendingDeleteTitle] = useState<string>("");

    const {
        documents,
        getAllDocuments,
        setCurrentDocumentId,
        currentDocumentId,
    } = useDocumentStore();
    const { deleteDocumentWithNavigation } = useDocumentStore();

    const { setNewDocModalOpen, setEditDocModalOpen, setEditDocId } = usePropStore();
    const { addNotification } = useNotificationStore();
    const { uploadFile } = useFileStore();
    const { getAllFolders, createFolder } = useFolderStore();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

    const myJwt = decodeJwt();

    useEffect(() => {
        getAllDocuments();
    }, [getAllDocuments]);

    useEffect(() => {
        if (confirmation && pendingDeleteId !== null) {
            deleteDocumentWithNavigation(pendingDeleteId, pendingDeleteTitle);
            setConfirmation(false);
            setPendingDeleteId(null);
            setPendingDeleteTitle("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmation]);

    const requestDelete = (documentId: number, title: string) => {
        setPendingDeleteId(documentId);
        setPendingDeleteTitle(title);
        setConfirmation(false);
        setOpenConfirmation(true);
    };

    const handleExport = async () => {
        if (!editor) return;
        setMenuAnchor(null);

        try {
            await getAllFolders();
            let exportsFolder = useFolderStore.getState().folders.find(
                (f) => f.name === "Exports"
            );

            if (!exportsFolder) {
                const created = await createFolder({ name: "Exports" } as FolderInput);
                if (created) {
                    exportsFolder = created;
                }
            }

            if (!exportsFolder) {
                throw new Error("Couldn't create Folder Exports");
            }

            const currentDoc = documents.find(
                (d) => d.documentId === currentDocumentId
            );

            const file = createMarkdownFile(
                editor.getHTML(),
                currentDoc?.title || "document"
            );

            await uploadFile({ file, folderId: exportsFolder.folderId });

            addNotification(
                `Export saved under: Files > Exports > ${file.name}`,
                "success"
            );
        } catch (error) {
            console.error("Export failed:", error);
            addNotification("Export failed", "error");
        }
    };

    return (
        <>
            <ToolbarGroup>
                <Button
                    variant="ghost"
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    aria-label="Document menu"
                >
                    File
                </Button>
                <Menu
                    anchorEl={menuAnchor}
                    open={!!menuAnchor}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                    <MenuItem
                        onClick={() => {
                            setNewDocModalOpen(true);
                            setMenuAnchor(null);
                        }}
                    >
                        New File
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleExport}>
                        <ListItemIcon>
                            <DownloadIcon fontSize="small" />
                        </ListItemIcon>
                        Export as .md
                    </MenuItem>
                    <Divider />
                    {documents.map((document) =>
                        document.documentMembershipList.includes(myJwt?.userId || 0) ? (
                            <MenuItem
                                key={document.documentId}
                                value={document.documentId}
                                selected={document.documentId === currentDocumentId}
                                onClick={() => {
                                    const { startLoading } = useNotificationStore.getState();
                                    startLoading();
                                    setCurrentDocumentId(document.documentId || 0);
                                    setMenuAnchor(null);
                                }}
                            >
                                <ListItemText primary={document.title} />

                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditDocId(document.documentId || 0);
                                        setEditDocModalOpen(true);
                                        setMenuAnchor(null);
                                    }}
                                >
                                    <SettingsIcon fontSize="small" />
                                </IconButton>

                                {document.creatorId === myJwt?.userId && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            requestDelete(document.documentId || 0, document.title);
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </MenuItem>
                        ) : null,
                    )}
                </Menu>
            </ToolbarGroup>

            <ToolbarGroup>
                <HeadingDropdownMenu modal={false} levels={[1, 2, 3]} />
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="underline" />
                <MarkButton type="strike" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ColorHighlightPopoverButton onClick={() => console.log("Highlighter")} />
                <LinkButton onClick={() => console.log("Link")} />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ListDropdownMenu
                    modal={false}
                    types={["bulletList", "orderedList", "taskList"]}
                />
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>
        </>
    );
};

const MobileMainToolbarContent = ({
                                      onHighlighterClick,
                                      onLinkClick,
                                  }: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
}) => {
    const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

    return (
        <>
            <ToolbarGroup>
                <MarkButton type="bold"/>
                <MarkButton type="italic"/>
                <MarkButton type="underline"/>
                <MarkButton type="strike"/>
                <UndoRedoButton action="undo"/>
                <UndoRedoButton action="redo"/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <Button
                    variant="ghost"
                    onClick={(e) => setMoreAnchor(e.currentTarget)}
                    aria-label="More formatting options"
                >
                    <MoreHorizIcon className="tiptap-button-icon"/>
                </Button>
                <Popover
                    anchorEl={moreAnchor}
                    open={!!moreAnchor}
                    onClose={() => setMoreAnchor(null)}
                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                    transformOrigin={{vertical: "top", horizontal: "left"}}
                    slotProps={{
                        paper: {
                            sx: {p: 1},
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            maxWidth: 220,
                        }}
                    >
                        <HeadingDropdownMenu modal={false} levels={[1, 2, 3]}/>
                        <ListDropdownMenu
                            modal={false}
                            types={["bulletList", "orderedList", "taskList"]}
                        />
                        <MarkButton type="code"/>
                        <MarkButton type="superscript"/>
                        <MarkButton type="subscript"/>
                        <ColorHighlightPopoverButton onClick={onHighlighterClick}/>
                        <LinkButton onClick={onLinkClick}/>
                        <CodeBlockButton/>
                        <BlockquoteButton/>
                        <TextAlignButton align="left"/>
                        <TextAlignButton align="center"/>
                        <TextAlignButton align="right"/>
                        <TextAlignButton align="justify"/>
                    </Box>
                </Popover>
            </ToolbarGroup>
        </>
    );
};

const MobileToolbarContent = ({
                                  type,
                                  onBack,
                              }: {
    type: "highlighter" | "link";
    onBack: () => void;
}) => (
    <>
        <ToolbarGroup>
            <Button variant="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon"/>
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon"/>
                ) : (
                    <LinkIcon className="tiptap-button-icon"/>
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator/>

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent/>
        ) : (
            <LinkContent/>
        )}
    </>
);

function SimpleEditorInner() {
    const provider = useHocuspocusProvider();
    const theme = useTheme();
    const isMobile = useIsBreakpoint();
    const {stopLoading, startLoading} = useNotificationStore();

    const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
        "main",
    );
    const toolbarRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            Collaboration.configure({document: provider.document}),
            CollaborationCaret.configure({
                provider,
                user: {name: decodeJwt()?.displayName, color: "#ffcc00"},
            }),
            HorizontalRule,
            TextAlign.configure({types: ["heading", "paragraph"]}),
            TaskList,
            TaskItem.configure({nested: true}),
            Highlight.configure({multicolor: true}),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
        ],
    });

    useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);

    useEffect(() => {
        const isDark = theme.palette.mode === "dark";
        document.documentElement.classList.toggle("dark", isDark);
    }, [theme.palette.mode]);

    useEffect(() => {
        // Start loading beim Switch
        startLoading();

        const handleSynced = () => {
            stopLoading();
        };

        provider.on("connected", () => { /* optional */
        });
        provider.on("synced", handleSynced);
        provider.on("status", ({status}: { status: string }) => {
            if (status === "connected") {
                stopLoading();
            }
        });

        return () => {
            provider.off("connected");
            provider.off("synced", handleSynced);
            provider.off("status");
        };
    }, [provider, startLoading, stopLoading]);


    return (
        <EditorContext.Provider value={{editor}}>
            <div className="editor-scroll-container">
                <div className="floating-toolbar-wrapper">
                    <Toolbar
                        ref={toolbarRef}
                        variant="floating"
                        className="floating-toolbar"
                        style={{
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        {!isMobile ? (
                            <MainToolbarContent/>
                        ) : mobileView === "main" ? (
                            <MobileMainToolbarContent
                                onHighlighterClick={() => setMobileView("highlighter")}
                                onLinkClick={() => setMobileView("link")}
                            />
                        ) : (
                            <MobileToolbarContent
                                type={mobileView === "highlighter" ? "highlighter" : "link"}
                                onBack={() => setMobileView("main")}
                            />
                        )}
                    </Toolbar>
                </div>

                <div
                    className="editor-page-background"
                    style={{backgroundColor: theme.palette.background.deep}}
                >
                    <Paper
                        elevation={3}
                        className="editor-sheet"
                        style={isMobile ? {} : {margin: "0 auto 40px"}}
                    >
                        <EditorContent
                            editor={editor}
                            role="presentation"
                            className="simple-editor-content"
                        />
                    </Paper>
                </div>
            </div>
        </EditorContext.Provider>
    );
}

export function SimpleEditor() {
    const {currentDocumentId} = useDocumentStore();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    if (!currentDocumentId) {
        return <div>Kein Dokument ausgewählt</div>;
    }

    const wrapperStyle = isDesktop
        ? {marginLeft: 240, width: "calc(100vw - 240px)"}
        : {};

    return (
        <div className="simple-editor-wrapper" style={wrapperStyle}>
            <ConfirmationModal/>
            <HocuspocusProviderWebsocketComponent
                url={`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/collab`}
            >
                <HocuspocusRoom
                    key={currentDocumentId}
                    name={`doc-${currentDocumentId}`}
                    token={localStorage.getItem("jwt") || undefined}
                    onAuthenticationFailed={(data) => console.error(data.reason)}
                    onSynced={() => console.log("synced")}
                >
                    <SimpleEditorInner/>
                </HocuspocusRoom>
            </HocuspocusProviderWebsocketComponent>
        </div>
    );
}
