import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

// We need to extend the interface or just use any for props if we want to pass the socket info
// But the Console component was designed to take a string `consoleOutput`. 
// For xterm, we ideally want to stream data directly, not rely on a giant string prop update.
// However, to keep compatibility with the existing architecture where `ModalTerminal` calculates state,
// we might need to expose a method to write.

interface ConsoleProps {
    className?: string;
    onData?: (data: string) => void;
    terminalRef?: React.MutableRefObject<Terminal | null>;
}

export default function Console(props: ConsoleProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    
    // Store the latest onData callback in a ref to avoid stale closures in the xterm listener
    const onDataRef = useRef(props.onData);
    
    useEffect(() => {
        onDataRef.current = props.onData;
    }, [props.onData]);

    useEffect(() => {
        if (!divRef.current) return;

        // Initialize xterm
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 15,
            theme: {
                background: '#111827', // matching bg-gray-900 roughly
                foreground: '#f3f4f6',
                cursor: '#ffffff',
                selectionBackground: '#374151'
            },
            convertEol: true, // Treat \n as \r\n
        });

        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);

        // Delay opening to ensure DOM is ready and visible
        // This fixes the "can't access property dimensions" error when opening inside a modal
        const initTimeout = setTimeout(() => {
            if (divRef.current) {
                term.open(divRef.current);
                try {
                    fitAddon.fit();
                } catch (e) {
                    console.warn("Fit failed on init:", e);
                }
            }
        }, 0);

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;
        
        if (props.terminalRef) {
            props.terminalRef.current = term;
        }

        term.onData((data) => {
            if (onDataRef.current) {
                onDataRef.current(data);
            }
        });

        // Resize observer to refit
        const resizeObserver = new ResizeObserver(() => {
            try {
                fitAddon.fit();
            } catch (e) {
                // Ignore fit errors during resize (e.g. if hidden)
            }
        });
        resizeObserver.observe(divRef.current);

        return () => {
            clearTimeout(initTimeout);
            resizeObserver.disconnect();
            term.dispose();
        };
    }, []);

    return (
        <div className="h-full w-full overflow-hidden bg-gray-900 p-1" ref={divRef} />
    );
}
