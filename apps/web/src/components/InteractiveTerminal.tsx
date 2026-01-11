import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { io, Socket } from "socket.io-client";
import "xterm/css/xterm.css";

export interface InteractiveTerminalRef {
    write: (data: string) => void;
    input: (data: string) => void;
    onData: (callback: (data: string) => void) => void;
    onClose: (callback: () => void) => void;
    fit: () => void;
    clear: () => void;
    focus: () => void;
    connect: (path: string, command?: string) => void;
    disconnect: () => void;
}

interface InteractiveTerminalProps {
    className?: string;
    startingText?: string;
    socketUrl?: string;
    isInteractive?: boolean;
}

const InteractiveTerminal = forwardRef<InteractiveTerminalRef, InteractiveTerminalProps>((props, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const socketRef = useRef<Socket | null>(null);
    
    // Callbacks exposed to parent
    const onDataCallbackRef = useRef<((data: string) => void) | null>(null);
    const onCloseCallbackRef = useRef<(() => void) | null>(null);

    useImperativeHandle(ref, () => ({
        write: (data: string) => {
            xtermRef.current?.write(data);
        },
        input: (data: string) => {
             // If socket is active, send to socket
             if (socketRef.current && socketRef.current.connected) {
                 // Programmatic input usually implies a command execution, so we ensure a newline if strictly just a command
                 // But strictly speaking 'input' just sends data. 
                 // However, user said "myRef.input(..command..) will execute the command".
                 // So we append \r.
                 const commandToSend = data.endsWith('\r') ? data : data + '\r';
                 socketRef.current.emit('terminal:input', commandToSend);
             } else {
                 // Simulate user input by sending data/command to the registered onData handler local callback
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
             try {
                fitAddonRef.current?.fit();
             } catch (e) {
                 // ignore fit errors (e.g. if container is hidden)
             }
        },
        clear: () => {
            xtermRef.current?.clear();
        },
        focus: () => {
            xtermRef.current?.focus();
        },
        connect: (path: string, command: string = 'bash') => {
            // Disconnect if already connected
            if (socketRef.current) {
                socketRef.current.disconnect();
            }

            const url = props.socketUrl || 'http://localhost:3000';
            const socket = io(url, {
                transports: ['websocket']
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                xtermRef.current?.clear();
                // Start the terminal process on the backend
                socket.emit('terminal:start', { path, command });
                xtermRef.current?.focus();
                try {
                    fitAddonRef.current?.fit();
                } catch (e) {
                    // ignore
                }
            });

            socket.on('terminal:log', (data: string) => {
                xtermRef.current?.write(data);
            });

            socket.on('terminal:error', (data: string) => {
                xtermRef.current?.write(`\x1b[31m${data}\x1b[0m`);
            });

            socket.on('terminal:exit', (code: number) => {
                xtermRef.current?.write(`\r\n\x1b[33mProcess exited with code ${code}\x1b[0m\r\n`);
                if (onCloseCallbackRef.current) {
                    onCloseCallbackRef.current();
                }
            });
        },
        disconnect: () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }));

    useEffect(() => {
        if (!divRef.current) return;

        // Initialize xterm
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            theme: {
                background: '#111827', // bg-gray-900
                foreground: '#f3f4f6', // text-gray-100
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
                 
                 // Initial text
                 if (props.startingText) {
                    term.write(props.startingText);
                 }
            }
        }, 0);

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Handle user typing
        term.onData((data) => {
            // Forward input to socket if connected
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit('terminal:input', data);
            }
            // Also trigger local callback
            if (onDataCallbackRef.current) {
                onDataCallbackRef.current(data);
            }
        });

        // Resize observer to keep terminal fitting the container
        const resizeObserver = new ResizeObserver(() => {
            try {
                fitAddon.fit();
            } catch (e) {
                // ignore
            }
        });
        resizeObserver.observe(divRef.current);

        // Cleanup
        return () => {
            clearTimeout(initTimeout);
            resizeObserver.disconnect();
            
            // Trigger onClose callback if registered
            if (onCloseCallbackRef.current) {
                onCloseCallbackRef.current();
            }

            if (socketRef.current) {
                socketRef.current.disconnect();
            }

            term.dispose();
        };
    }, []); // Run once on mount

    // Update terminal options based on isInteractive prop
    useEffect(() => {
        if (!xtermRef.current) return;
        
        const interactive = props.isInteractive ?? true;
        
        xtermRef.current.options.disableStdin = !interactive;
        xtermRef.current.options.cursorBlink = interactive;
        xtermRef.current.options.cursorStyle = interactive ? 'block' : 'underline'; // visually distinguish or hide
        
        // If not interactive, we might want to hide the cursor entirely, 
        // but xterm doesn't have "hidden" cursor style easily without CSS.
        // We can set cursorInactiveStyle or just rely on blink/style.
        // Actually, setting theme cursor to transparent works best for hiding.
        if (!interactive) {
            xtermRef.current.options.theme = {
                ...xtermRef.current.options.theme,
                cursor: 'transparent'
            };
        } else {
            xtermRef.current.options.theme = {
                ...xtermRef.current.options.theme,
                cursor: '#ffffff'
            };
        }

    }, [props.isInteractive]);

    return (
        <div 
            className={`h-full w-full overflow-hidden bg-gray-900 p-1 ${props.className || ''}`} 
            ref={divRef} 
        />
    );
});

InteractiveTerminal.displayName = "InteractiveTerminal";

export default InteractiveTerminal;
