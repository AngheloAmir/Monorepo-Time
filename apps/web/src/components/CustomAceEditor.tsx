import { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import ace from "ace-builds";

// Configure ace basePath for Vite - must be done before importing modes/themes
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.32.6/src-noconflict/");

// Import necessary ace-builds
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface DiffMarkers {
    added: number[];
    modified: number[];
}

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    mode?: "json" | "javascript" | "typescript";
    theme?: "monokai" | "github";
    readOnly?: boolean;
    height?: string;
    width?: string;
    className?: string;
    wrapperClassName?: string;
    transparent?: boolean;
    diffMarkers?: DiffMarkers;

    onSave?: () => void;
    rightClickMenu?: (line: number, column: number, selectedText: string, selection?: { startLine: number; endLine: number }) => void;
    contextMenuComponent?: React.ReactNode;
}

export default function CustomAceEditor({
    value = "",
    onChange,
    mode = "json",
    theme = "monokai",
    readOnly = false,
    height = "100%",
    width = "100%",
    className,
    wrapperClassName,
    transparent = false,
    diffMarkers,

    onSave,
    rightClickMenu,
    contextMenuComponent,
}: Props) {
    const [focused, setFocused] = useState(false);
    const [editorId] = useState(() => `ace-editor-${Math.random()}`);
    const editorRef = useRef<AceEditor | null>(null);
    const markerIdsRef = useRef<number[]>([]);
    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setContextMenuPos(null);
            }
        };
        // Use mousedown to capture clicks before other components can stop propagation
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Apply diff markers when they change
    useEffect(() => {
        if (!editorRef.current || !diffMarkers) return;

        const editor = editorRef.current.editor;
        const session = editor.getSession();

        // Remove existing markers
        markerIdsRef.current.forEach(id => {
            session.removeMarker(id);
        });
        markerIdsRef.current = [];

        // Add markers for added lines (green)
        diffMarkers.added.forEach(lineNumber => {
            const Range = ace.require("ace/range").Range;
            const range = new Range(lineNumber - 1, 0, lineNumber - 1, 1);
            const markerId = session.addMarker(range, "ace-diff-added", "fullLine", true);
            markerIdsRef.current.push(markerId);
        });

        // Add markers for modified lines (orange)
        diffMarkers.modified.forEach(lineNumber => {
            const Range = ace.require("ace/range").Range;
            const range = new Range(lineNumber - 1, 0, lineNumber - 1, 1);
            const markerId = session.addMarker(range, "ace-diff-modified", "fullLine", true);
            markerIdsRef.current.push(markerId);
        });
    }, [diffMarkers]);


    // Handle Right Click Menu
    useEffect(() => {
        if (!editorRef.current || (!rightClickMenu && !contextMenuComponent)) return;

        const editor = editorRef.current.editor;
        const container = editor.container;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const { clientX, clientY } = e;
            const pos = editor.renderer.screenToTextCoordinates(clientX, clientY);
            
            if (rightClickMenu) {
                const selectedText = editor.getSelectedText();
                const selectionRange = editor.getSelectionRange();
                const selection = selectedText ? {
                    startLine: selectionRange.start.row + 1,
                    endLine: selectionRange.end.row + 1
                } : undefined;
                
                rightClickMenu(pos.row + 1, pos.column, selectedText, selection);
            }
            
            if (contextMenuComponent) {
                setContextMenuPos({ x: clientX, y: clientY });
            }
        };

        container.addEventListener("contextmenu", handleContextMenu);

        return () => {
            container.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [rightClickMenu, contextMenuComponent]);
    return (
        <div className={`h-full w-full ${wrapperClassName || ""}`}>
            {/* Diff marker styles */}
            <style>
                {`
                    .ace-diff-added {
                        position: absolute;
                        background-color: rgba(46, 160, 67, 0.25) !important;
                        border-left: 3px solid #2ea043 !important;
                    }
                    .ace-diff-modified {
                        position: absolute;
                        background-color: rgba(255, 166, 0, 0.2) !important;
                        border-left: 3px solid #ffa600 !important;
                    }
                `}
            </style>
            {transparent && (
                <style>
                    {`
                        #${editorId.replace(/\./g, "\\.")} {
                            background-color: transparent !important;
                        }
                        #${editorId.replace(/\./g, "\\.")} .ace_gutter {
                            background-color: transparent !important;
                            color: #8F908A; /* Monokai gutter text color preserved, modify if needed */
                        }
                        #${editorId.replace(/\./g, "\\.")} .ace_scroller {
                            background-color: transparent !important;
                        }
                        #${editorId.replace(/\./g, "\\.")} .ace_marker-layer .ace_active-line {
                            background-color: transparent !important;
                        }
                        #${editorId.replace(/\./g, "\\.")} .ace_gutter-active-line {
                            background-color: transparent !important;
                        }
                    `}
                </style>
            )}
            {contextMenuComponent && contextMenuPos && (
                <div
                    ref={contextMenuRef}
                    style={{
                        position: "fixed",
                        top: contextMenuPos.y,
                        left: contextMenuPos.x,
                        zIndex: 9999,
                    }}
                >
                    {contextMenuComponent}
                </div>
            )}
            <AceEditor
                ref={editorRef}
                mode={mode}
                theme={theme}
                onChange={onChange}
                value={value}
                name={editorId}
                commands={[
                    {
                        name: "save",
                        bindKey: { win: "Ctrl-S", mac: "Command-S" },
                        exec: () => {
                            if (onSave) onSave();
                        },
                    },
                ]}
                editorProps={{ $blockScrolling: true }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    showPrintMargin: false,
                    tabSize: 2,
                    useWorker: false,
                    fontFamily: "monospace",
                    fontSize: 14,
                    highlightActiveLine: focused,
                }}
                height={height}
                width={width}
                className={className}
                readOnly={readOnly}
                style={transparent ? { backgroundColor: "transparent" } : undefined}
            />
        </div>
    );
}