"use client";

import {useEffect, useRef, useState} from "react";
import {EditorContent, EditorContext, useEditor} from "@tiptap/react";
import { useTheme } from "@mui/material/styles";
import {Divider, useMediaQuery} from "@mui/material";

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
import {Spacer} from "@/components/tiptap-ui-primitive/spacer";
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import {ImageUploadNode} from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import {HorizontalRule} from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import {HeadingDropdownMenu} from "@/components/tiptap-ui/heading-dropdown-menu";
import {ImageUploadButton} from "@/components/tiptap-ui/image-upload-button";
import {ListDropdownMenu} from "@/components/tiptap-ui/list-dropdown-menu";
import {BlockquoteButton} from "@/components/tiptap-ui/blockquote-button";
import {CodeBlockButton} from "@/components/tiptap-ui/code-block-button";
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover";
import {MarkButton} from "@/components/tiptap-ui/mark-button";
import {TextAlignButton} from "@/components/tiptap-ui/text-align-button";
import {UndoRedoButton} from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import {ArrowLeftIcon} from "@/components/tiptap-icons/arrow-left-icon";
import {HighlighterIcon} from "@/components/tiptap-icons/highlighter-icon";
import {LinkIcon} from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import {useIsBreakpoint} from "@/hooks/use-is-breakpoint";

// --- Lib ---
import {handleImageUpload, MAX_FILE_SIZE} from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

// mine
import {useHocuspocusProvider} from "@hocuspocus/provider-react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom,
} from "@hocuspocus/provider-react";
import {decodeJwt} from "../../../../../stores/AuthStore";
import {Paper} from "@mui/material";
import {useDocumentStore} from "../../../../../stores/DocumentStore";
import MenuItem from "@mui/material/MenuItem";
import {usePropStore} from "../../../../../stores/PropStore.ts";
import Menu from "@mui/material/Menu";

const MainToolbarContent = ({
                                onHighlighterClick,
                                onLinkClick,
                                isMobile,
                            }: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
}) => {
    const {
        documents,
        getAllDocuments,
        setCurrentDocumentId,
        currentDocumentId,
    } = useDocumentStore();
    const { setNewDocModalOpen } = usePropStore();
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

    const myJwt = decodeJwt();

    useEffect(() => {
        getAllDocuments();
    }, [getAllDocuments]);

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
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <MenuItem onClick={() => {
                        setNewDocModalOpen(true);
                        setMenuAnchor(null);
                    }}>
                        New File
                    </MenuItem>
                    <Divider />
                    {documents.map((document) =>
                        document.documentMembershipList.includes(myJwt?.userId || 0) ? (
                            <MenuItem
                                key={document.documentId}
                                value={document.documentId}
                                selected={document.documentId === currentDocumentId}
                                onClick={() => {
                                    setCurrentDocumentId(document.documentId || 0);
                                    setMenuAnchor(null);
                                }}
                            >
                                {document.title}
                            </MenuItem>
                        ) : null,
                    )}
                </Menu>
            </ToolbarGroup>
            <ToolbarGroup>
                <UndoRedoButton action="undo"/>
                <UndoRedoButton action="redo"/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]}/>
                <ListDropdownMenu
                    modal={false}
                    types={["bulletList", "orderedList", "taskList"]}
                />
                <BlockquoteButton/>
                <CodeBlockButton/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <MarkButton type="bold"/>
                <MarkButton type="italic"/>
                <MarkButton type="strike"/>
                <MarkButton type="code"/>
                <MarkButton type="underline"/>
                {!isMobile ? (
                    <ColorHighlightPopover/>
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick}/>
                )}
                {!isMobile ? <LinkPopover/> : <LinkButton onClick={onLinkClick}/>}
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <MarkButton type="superscript"/>
                <MarkButton type="subscript"/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <TextAlignButton align="left"/>
                <TextAlignButton align="center"/>
                <TextAlignButton align="right"/>
                <TextAlignButton align="justify"/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <ImageUploadButton text="Add"/>
            </ToolbarGroup>

            <Spacer/>

            {isMobile && <ToolbarSeparator/>}

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
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
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

    return (
        <EditorContext.Provider value={{editor}}>
            <div className="editor-scroll-container">
                <div className="floating-toolbar-wrapper">
                    <Toolbar
                        ref={toolbarRef}
                        className="floating-toolbar"
                        style={{
                            backgroundColor: theme.palette.background.paper,
                            ...(isMobile
                                ? {
                                    position: "fixed",
                                    bottom: 16,
                                    left: 0,
                                    right: 0,
                                }
                                : {}),
                        }}
                    >
                        {mobileView === "main" ? (
                            <MainToolbarContent
                                onHighlighterClick={() => setMobileView("highlighter")}
                                onLinkClick={() => setMobileView("link")}
                                isMobile={isMobile}
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
                    style={{ backgroundColor: theme.palette.background.deep }}
                >
                    <Paper
                        elevation={3}
                        className="editor-sheet"
                        style={isMobile ? {} : {maxWidth: "850px", margin: "0 auto 40px"}}
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
        ? { marginLeft: 240, width: "calc(100vw - 240px)" }
        : {};

    return (
        <div className="simple-editor-wrapper" style={wrapperStyle}>
            <HocuspocusProviderWebsocketComponent
                url={`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/collab`}
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