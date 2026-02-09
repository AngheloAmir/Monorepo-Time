import { useState } from "react";
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
}: Props) {
    const [focused, setFocused] = useState(false);
    const [editorId] = useState(() => `ace-editor-${Math.random()}`);

    return (
        <div className={`h-full w-full ${wrapperClassName || ""}`}>
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
            <AceEditor
                mode={mode}
                theme={theme}
                onChange={onChange}
                value={value}
                name={editorId}
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