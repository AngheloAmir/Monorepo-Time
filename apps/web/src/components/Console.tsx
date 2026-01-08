import { AnsiUp } from "ansi_up";
import { useEffect, useRef, useState } from "react";

export default function Console( {consoleOutput, componentHeight}: {consoleOutput: string | null, componentHeight: number}) {
    const [html, setHtml] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!consoleOutput) {
            setHtml("");
            return;
        }
        const ansi_up = new AnsiUp();
        const html    = ansi_up.ansi_to_html(consoleOutput);
        setHtml(html);
        setTimeout(() => {
            ref.current?.scrollTo({
                top: ref.current.scrollHeight,
            });
        }, 0);
    }, [consoleOutput]);

    return (
        <div 
            ref={ref} 
            className="overflow-y-scroll bg-transparent font-mono text-sm whitespace-pre-wrap"
            style={{ height: componentHeight }}
        >
            <div 
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}