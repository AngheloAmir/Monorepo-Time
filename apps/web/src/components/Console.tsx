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
    const ESC = "\x1b[";
    const regex = new RegExp(`${ESC}[0-9;]*m`, "g");

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let classList: string[] = [];
    const tokens: Token[] = [];

    while ((match = regex.exec(input))) {
        const chunk = input.slice(lastIndex, match.index);
        if (chunk) {
            tokens.push({
                text: chunk,
                className: classList.join(" "),
            });
        }

        const codes = match[0]
            .replace(ESC, "")
            .replace("m", "")
            .split(";")
            .map(Number);

        for (const code of codes) {
            if (code === 0) {
                classList = [];
            } else if (code === 1) {
                classList.push("font-bold");
            } else if (COLOR_MAP[code]) {
                classList.push(COLOR_MAP[code]);
            } else if (BG_MAP[code]) {
                classList.push(BG_MAP[code]);
            }
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < input.length) {
        tokens.push({
            text: input.slice(lastIndex),
            className: classList.join(" "),
        });
    }

    return tokens;
}

export default function Console({ consoleOutput, show }: { consoleOutput: string | null; show: boolean }) {
    const [tokens, setTokens] = useState<Token[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!consoleOutput) {
            setTokens([]);
            return;
        }

        const parsed = parseAnsi(consoleOutput);
        setTokens(parsed);

        setTimeout(() => {
            ref.current?.scrollTo({
                top: ref.current.scrollHeight,
            });
        }, 1);
    }, [consoleOutput]);

    return (
        <div ref={ref}
            className={`font-mono text-sm whitespace-pre-wrap overflow-y-auto h-full min-h-0 ${show ? '' : 'hidden'}`}>
            {tokens.map((t, i) => (
                <span key={i} className={t.className}>
                    {t.text}
                </span>
            ))}
        </div>
    );
}
