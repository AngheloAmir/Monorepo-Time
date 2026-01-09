import { useEffect, useRef, useState } from "react";

type Token = {
    text: string;
    className: string;
};

const COLOR_MAP: Record<number, string> = {
    30: "text-black",
    31: "text-red-400",
    32: "text-green-400",
    33: "text-yellow-400",
    34: "text-blue-400",
    35: "text-purple-400",
    36: "text-cyan-400",
    37: "text-gray-200",

    90: "text-gray-400",
    91: "text-red-500",
    92: "text-green-500",
    93: "text-yellow-500",
    94: "text-blue-500",
    95: "text-purple-500",
    96: "text-cyan-500",
    97: "text-white",
};

const BG_MAP: Record<number, string> = {
    40: "bg-black",
    41: "bg-red-700",
    42: "bg-green-700",
    43: "bg-yellow-700",
    44: "bg-blue-700",
    45: "bg-purple-700",
    46: "bg-cyan-700",
    47: "bg-gray-300",
};

function parseAnsi(input: string): Token[] {
    // Regex matches the ANSI escape sequence: \x1b[<numbers>m
    const regex = /\x1b\[[0-9;]*m/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    
    // State to track current style
    let currentStyle = {
        foreground: "",
        background: "",
        bold: false
    };

    const tokens: Token[] = [];

    // Helper to generate class string from current style
    const getClassName = (style: typeof currentStyle) => {
        const classes = [];
        if (style.foreground) classes.push(style.foreground);
        if (style.background) classes.push(style.background);
        if (style.bold) classes.push("font-bold");
        return classes.join(" ");
    };

    while ((match = regex.exec(input))) {
        // Push text before this code, styled with PREVIOUS style
        const chunk = input.slice(lastIndex, match.index);
        if (chunk) {
            tokens.push({
                text: chunk,
                className: getClassName(currentStyle),
            });
        }

        // Process the codes in this match
        // match[0] is like "\x1b[31;1m"
        const codes = match[0]
            .slice(2, -1) // remove "\x1b[" and "m"
            .split(";")
            .map(val => parseInt(val) || 0); // Default to 0 if empty

        for (const code of codes) {
            if (code === 0) {
                // Reset all
                currentStyle = { foreground: "", background: "", bold: false };
            } else if (code === 1) {
                currentStyle.bold = true;
            } else if (COLOR_MAP[code]) {
                currentStyle.foreground = COLOR_MAP[code];
            } else if (BG_MAP[code]) {
                currentStyle.background = BG_MAP[code];
            } else if (code === 22) {
                 // 22 is "Normal color or intensity" (not bold)
                 currentStyle.bold = false;
            } else if (code === 39) {
                 // Default foreground
                 currentStyle.foreground = "";
            } else if (code === 49) {
                 // Default background
                 currentStyle.background = "";
            }
        }

        lastIndex = regex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < input.length) {
        tokens.push({
            text: input.slice(lastIndex),
            className: getClassName(currentStyle),
        });
    }

    return tokens;
}

export default function Console({ consoleOutput, show }: { consoleOutput: string | null; show: boolean }) {
    const [tokens, setTokens] = useState<Token[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    // Helper to merge tokens that might have split a URL (e.g. localhost: <color>port</color>)
    const mergeUrlTokens = (tokens: Token[]): Token[] => {
        const merged: Token[] = [];
        for (let i = 0; i < tokens.length; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];

            if (next && current.text.match(/(?:https?:\/\/|localhost:|127\.0\.0\.1:)$/) && next.text.match(/^\d+/)) {
                // Merge current and next
                merged.push({
                    text: current.text + next.text,
                    className: current.className, // Keep style of the protocol/host part
                });
                i++; // Skip next token
            } else {
                merged.push(current);
            }
        }
        return merged;
    };

    useEffect(() => {
        if (!consoleOutput) {
            setTokens([]);
            return;
        }

        const parsed = parseAnsi(consoleOutput);
        const merged = mergeUrlTokens(parsed);
        setTokens(merged);

        setTimeout(() => {
            ref.current?.scrollTo({
                top: ref.current.scrollHeight,
            });
        }, 1);
    }, [consoleOutput]);

    // Helper to render links
    const renderWithLinks = (text: string) => {
        // Regex to find URLs (http/https), localhost with ports, or 127.0.0.1 with ports
        // capturing the whole string as one group for the split
        const urlRegex = /((?:https?:\/\/|localhost:|127\.0\.0\.1:)\S+)/g;
        
        return text.split(urlRegex).map((part, i) => {
             // Basic check if it looks like what we wanted
            if (part.match(/^(?:https?:\/\/|localhost:|127\.0\.0\.1:)/)) {
                let href = part;
                let display = part;
                let suffix = '';

                // Strip trailing punctuation often found in logs
                // e.g. "Running on http://localhost:3000." -> suffix="."
                const trailing = part.match(/[.,;)]+$/);
                if (trailing) {
                    suffix = trailing[0];
                    href = href.slice(0, -suffix.length);
                    display = display.slice(0, -suffix.length);
                }

                if (!href.startsWith('http')) {
                    href = 'http://' + href;
                }

                return (
                    <span key={i}>
                        <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 cursor-pointer"
                        >
                            {display}
                        </a>
                        {suffix}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div ref={ref}
            className={`font-mono text-sm whitespace-pre-wrap overflow-y-auto h-full min-h-0 ${show ? '' : 'hidden'}`}>
            {tokens.map((t, i) => (
                <span key={i} className={t.className}>
                    {renderWithLinks(t.text)}
                </span>
            ))}
        </div>
    );
}
