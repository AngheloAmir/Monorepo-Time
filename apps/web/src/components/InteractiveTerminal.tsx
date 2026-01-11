import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { io, Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

export interface InteractiveTerminalRef {
    /** Writes data directly to the xterm instance */
    write: (data: string) => void;
    /** Sends input data to the connected socket terminal process */
    input: (data: string) => void;
    /** Registers a callback to receive data events from the terminal */
    onData: (callback: (data: string) => void) => void;
    /** Registers a callback to be called when the terminal process closes */
    onClose: (callback: () => void) => void;
    /** Triggers the fit addon to resize the terminal to its container */
    fit: () => void;
    /** Clears the terminal buffer */
    clear: () => void;
    /** Focuses the terminal input */
    focus: () => void;
    /** Manually initiates a connection to a terminal process */
    connect: (path: string, command?: string) => void;
    /** Manually disconnects the socket connection */
    disconnect: () => void;
}

interface InteractiveTerminalProps {
    /** CSS class names for the container */
    className?: string;
    /** Initial text to display in the terminal before connection */
    startingText?: string;
    /** Custom socket.io URL (default: http://localhost:3000) */
    socketUrl?: string;
    /** Whether the terminal accepts user input (default: true) */
    isInteractive?: boolean;
    /** The working directory path to start the terminal process in */
    path?: string;
    /** The command to execute (e.g. 'bash') */
    command?: string;
    /** Callback function called when the process exits */
    onExit?: () => void;
}

/** An interactive terminal
 * 
 * @example
 * ```tsx
 * import InteractiveTerminal, { type InteractiveTerminalRef } from "./InteractiveTerminal";
 *
 * export default function MyTerminal() {
 *     const terminalRef = useRef<InteractiveTerminalRef>(null);
 *     useEffect(() => {
 *         if (terminalRef.current) {
 *             setTimeout(() => {
 *                 terminalRef.current?.connect(rootDir);
 *                 terminalRef.current?.focus();
 *             }, 50);
 *             return () => {
 *                 if(terminalRef.current) {
 *                     terminalRef.current.disconnect();
 *                 }
 *             }
 *         }
 *     }, []);
 *
 *     return (
 *         <InteractiveTerminal 
 *             ref={terminalRef}
 *             isInteractive={true}
 *             className="h-full"
 *             onExit={() => console.log("Terminal exited")}
 *         />
 *     )
 * }
 * ```
 */
const InteractiveTerminal = forwardRef<InteractiveTerminalRef, InteractiveTerminalProps>((props, ref) => {
    // We hold the Terminal instance here to control it directly
    const terminalRef = useRef<Terminal | null>(null);
    // Reference to the Console component (mainly for fit())
    const consoleComponentRef = useRef<ConsoleRef | null>(null);
    
    const socketRef = useRef<Socket | null>(null);
    
    // Callbacks exposed to parent via the Ref interface
    const onDataCallbackRef = useRef<((data: string) => void) | null>(null);
    const onCloseCallbackRef = useRef<(() => void) | null>(null);

    // Helper to disconnect socket
    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    };

    // Helper to connect socket
    const connectSocket = (path: string, command: string = 'bash') => {
        disconnectSocket();

        const url = props.socketUrl || 'http://localhost:3000';
        const socket = io(url, {
            transports: ['websocket'],
            forceNew: true, // Important for connection stability
            reconnection: false // We manage lifecycle manually, so disable auto-reconnect to avoid race conditions
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            terminalRef.current?.clear();
            // Start the terminal process on the backend
            socket.emit('terminal:start', { path, command });
            terminalRef.current?.focus();
            
            // Try fitting again after connection
            setTimeout(() => {
                consoleComponentRef.current?.fit();
            }, 100);
        });

        socket.on('terminal:log', (data: string) => {
            terminalRef.current?.write(data);
        });

        socket.on('terminal:error', (data: string) => {
            terminalRef.current?.write(`\x1b[31m${data}\x1b[0m`);
        });

        socket.on('terminal:exit', (code: number) => {
            terminalRef.current?.write(`\r\n\x1b[33mProcess exited with code ${code}\x1b[0m\r\n`);
            if (onCloseCallbackRef.current) {
                onCloseCallbackRef.current();
            }
            if (props.onExit) {
                props.onExit();
            }
        });
    };

    useImperativeHandle(ref, () => ({
        write: (data: string) => {
            terminalRef.current?.write(data);
        },
        input: (data: string) => {
             // If socket is active, send to socket
             if (socketRef.current && socketRef.current.connected) {
                 // Programmatic input usually implies a command execution, so we ensure a newline if strictly just a command
                 const commandToSend = data.endsWith('\r') ? data : data + '\r';
                 socketRef.current.emit('terminal:input', commandToSend);
             } else {
                 // Simulate user input by sending data/command to the registered onData handler local callback
                 // This effectively loops it back to the terminal if someone's listening
                 if (onDataCallbackRef.current) {
                     onDataCallbackRef.current(data + '\r');
                 }
             }
        },
        onData: (callback: (data: string) => void) => {
            onDataCallbackRef.current = callback;
        },
        onClose: (callback: () => void) => {
            onCloseCallbackRef.current = callback;
        },
        fit: () => {
            consoleComponentRef.current?.fit();
        },
        clear: () => {
            terminalRef.current?.clear();
        },
        focus: () => {
            terminalRef.current?.focus();
        },
        connect: (path: string, command: string = 'bash') => {
            connectSocket(path, command);
        },
        disconnect: () => {
            disconnectSocket();
        }
    }));

    // Handle initial text
    useEffect(() => {
        if (props.startingText && terminalRef.current) {
            terminalRef.current.write(props.startingText);
        }
    }, [props.startingText]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectSocket(); 
        };
    }, []);

    // Handle interactivity changes
    useEffect(() => {
        const term = terminalRef.current;
        if (!term) return;
        
        const interactive = props.isInteractive ?? true;
        
        term.options.disableStdin = !interactive;
        term.options.cursorBlink = interactive;
        term.options.cursorStyle = interactive ? 'block' : 'underline';
        
        if (!interactive) {
            term.options.theme = {
                ...term.options.theme,
                cursor: 'transparent'
            };
        } else {
            term.options.theme = {
                ...term.options.theme,
                cursor: '#ffffff'
            };
        }

    }, [props.isInteractive]);

    const handleData = (data: string) => {
        // Forward input to socket if connected
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('terminal:input', data);
        }
        // Also trigger local callback (for parents listening to raw input)
        if (onDataCallbackRef.current) {
            onDataCallbackRef.current(data);
        }
    };

    return (
        <div className={`h-full w-full ${props.className || ''}`}>
            <Console 
                ref={consoleComponentRef}
                terminalRef={terminalRef}
                onData={handleData}
            />
        </div>
    );
});

InteractiveTerminal.displayName = "InteractiveTerminal";
export default InteractiveTerminal;

interface ConsoleProps {
    className?: string;
    onData?: (data: string) => void;
    terminalRef?: React.MutableRefObject<Terminal | null>;
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

    useImperativeHandle(ref, () => ({
        fit: () => {
             try {
                fitAddonRef.current?.fit();
             } catch (e) {
                 // ignore
             }
        }
    }));
    
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
});