import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

export interface OpenCodeTerminalRef {
    /** Focuses the terminal input */
    focus: () => void;
    /** Manually initiates a connection to a terminal process */
    connect: (path: string, command: string) => void;
    /** Manually disconnects the socket connection */
    disconnect: () => void;
    /** Fits the terminal to the container */
    fit: () => void;
    /** Clears the terminal buffer */
    clear: () => void;
}

// ... (props interface unchanged) ...
interface OpenCodeTerminalProps {
    /** CSS class names for the container */
    className?: string;
    /** Custom socket.io URL (default: http://localhost:3000) */
    socketUrl?: string;
    /** Callback function called when the process exits */
    onExit?: () => void;
    /** Callback function called when the process crashes (non-zero exit) */
    onCrash?: (code: number) => void;
}

/** An interactive terminal optimized for Opencode */
const OpenCodeTerminal = forwardRef<OpenCodeTerminalRef, OpenCodeTerminalProps>((props, ref) => {
    // We hold the Terminal instance here to control it directly
    const terminalRef = useRef<Terminal | null>(null);
    // Reference to the Console component (mainly for fit())
    const consoleComponentRef = useRef<ConsoleRef | null>(null);
    
    const socketRef = useRef<Socket | null>(null);
    
    // Helper to disconnect socket
    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.removeAllListeners();
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    // Helper to connect socket
    const connectSocket = async (path: string, command: string) => {
        disconnectSocket();
        const { io } = await import("socket.io-client");

        const url      = props.socketUrl;
        const socket   = io(url, {
            transports: ['websocket'],
            forceNew: true, // Important for connection stability
            reconnection: false // We manage lifecycle manually
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            terminalRef.current?.clear();
            
            if( command !=  'bash' ) {
                terminalRef.current?.write(`\x1b[34m${path}\x1b[0m: ${command}\r\n`);
            }

            socket.emit('opencode:start', { path, command });
            terminalRef.current?.focus();
            
            // Try fitting again after connection
            setTimeout(() => {
                consoleComponentRef.current?.fit();
            }, 100);
        });

        socket.on('opencode:log', (data: string) => {
            terminalRef.current?.write(data);
        });

        socket.on('opencode:error', (data: string) => {
            terminalRef.current?.write(`\x1b[31m${data}\x1b[0m`);
        });

        socket.on('opencode:exit', (code: number) => {
            terminalRef.current?.write(`\r\n\x1b[33mProcess exited with code ${code}\x1b[0m\r\n`);
            
            if (code !== 0) {
                if (props.onCrash) {
                    props.onCrash(code);
                }
            }

            if (props.onExit) {
                props.onExit();
            }
        });
    };

    useImperativeHandle(ref, () => ({
        focus: () => {
            terminalRef.current?.focus();
        },
        connect: (path: string, command: string) => {
            connectSocket(path, command);
        },
        disconnect: () => {
            disconnectSocket();
        },
        fit: () => {
             consoleComponentRef.current?.fit();
        },
        clear: () => {
             terminalRef.current?.clear();
        }
    }));
    
    // ... (rest of component unchanged) ...

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectSocket(); 
        };
    }, []);

    const handleData = (data: string) => {
        // Forward input to socket if connected
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('opencode:input', data);
        }
    };

    const handleResize = (cols: number, rows: number) => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('opencode:resize', { cols, rows });
        }
    };

    return (
        <div className={`h-full w-full ${props.className || ''}`}>
            <Console 
                ref={consoleComponentRef}
                terminalRef={terminalRef}
                onData={handleData}
                onResize={handleResize}
            />
        </div>
    );
});

OpenCodeTerminal.displayName = "OpenCodeTerminal";
export default OpenCodeTerminal;

interface ConsoleProps {
    className?: string;
    onData?: (data: string) => void;
    terminalRef?: React.MutableRefObject<Terminal | null>;
    onResize?: (cols: number, rows: number) => void;
}

export interface ConsoleRef {
    fit: () => void;
}

const Console = forwardRef<ConsoleRef, ConsoleProps>((props, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    
    // Store the latest onData callback in a ref to avoid stale closures in the xterm listener
    const onDataRef = useRef(props.onData);
    const onResizeRef = useRef(props.onResize);

    useImperativeHandle(ref, () => ({
        fit: () => {
             try {
                fitAddonRef.current?.fit();
                if (xtermRef.current && onResizeRef.current) {
                    onResizeRef.current(xtermRef.current.cols, xtermRef.current.rows);
                }
             } catch (e) {
                 // ignore
             }
        }
    }));
    
    useEffect(() => {
        onDataRef.current = props.onData;
    }, [props.onData]);

    useEffect(() => {
        onResizeRef.current = props.onResize;
    }, [props.onResize]);

    useEffect(() => {
        if (!divRef.current) return;

        // Initialize xterm
        const term = new Terminal({
            cursorBlink: true,
            allowTransparency: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 15,
            theme: {
                background: '#00000000', // transparent
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

        term.attachCustomKeyEventHandler((event) => {
             // Capture Ctrl+<Key> combinations to prevent browser defaults (like Ctrl+P, Ctrl+S)
             // and ensure they are sent to the terminal.
             if (event.type === 'keydown' && event.ctrlKey) {
                 if (event.code === 'KeyZ' || event.code === 'KeyC' || event.code === 'KeyV') {
                     event.preventDefault();
                     return false;
                 }
                 if (event.code === 'KeyT') {
                    event.preventDefault();
                    return true;
                 }
                 event.preventDefault();
                 return true;
             }
             return true;
        });

        // Delay opening to ensure DOM is ready and visible
        // This fixes the "can't access property dimensions" error when opening inside a modal
        const initTimeout = setTimeout(() => {
            if (divRef.current) {
                term.open(divRef.current);
                try {
                    fitAddon.fit();
                    if (onResizeRef.current) {
                        onResizeRef.current(term.cols, term.rows);
                    }
                } catch (e) {
                    // ignore
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
                if (onResizeRef.current) {
                    onResizeRef.current(term.cols, term.rows);
                }
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

    useEffect(() => {
        const div = divRef.current;
        if (!div) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy';
            }
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            const data = e.dataTransfer?.getData('text/plain');
            if (data && onDataRef.current) {
                onDataRef.current(data);
                xtermRef.current?.focus();
            }
        };

        div.addEventListener('dragover', handleDragOver as unknown as EventListener);
        div.addEventListener('drop', handleDrop as unknown as EventListener);

        return () => {
            div.removeEventListener('dragover', handleDragOver as unknown as EventListener);
            div.removeEventListener('drop', handleDrop as unknown as EventListener);
        };
    }, []);

    return (
        <div className="h-full w-full overflow-hidden bg-transparent" ref={divRef} />
    );
});