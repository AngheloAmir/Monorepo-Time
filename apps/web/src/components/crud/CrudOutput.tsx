import { useState, useEffect, useRef } from "react";
import useCrudState from "../../appstates/crud";
import CodeExample from "./CodeExample";

export default function CrudOutput() {
    const output = useCrudState.use.output();
    const contentRef    = useRef<HTMLPreElement>(null);
    const [content, setContent] = useState<string>('');
    const [showCode, setShowCode] = useState(false);

    useEffect(() => {
        setValue(output);
    }, [output]);

    const setValue = (val: any) => {
        try {
            let data = val;
            if (typeof val === 'string') {
                try {
                    data = JSON.parse(val);
                } catch (e) {
                    // ignore, keep as string
                }
            }

            let stringVal = '';
            let applyHighlight = false;

            if (typeof data === 'object' && data !== null) {
                stringVal = JSON.stringify(data, null, 2);
                applyHighlight = true;
            } else {
                stringVal = String(data);
            }

            let html = stringVal
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            if (applyHighlight) {
                // Keys: "key": -> green
                html = html.replace(/"([^"]+)":/g, '<span class="text-green-400">"$1"</span>:');

                // Punctuation
                html = html.replace(/([{}\[\],])/g, (match) => {
                    return `<span class="text-gray-500">${match}</span>`;
                });
            }

            setContent(html);
        } catch (error) {
            setContent("Invalid output");
        }
    };

    const handleSave = () => {
        const raw = JSON.stringify(output, null, 2);
        localStorage.setItem('crud-output-last', raw);
        alert('Output saved to LocalStorage');
    };

    const handleLoad = () => {
        const saved = localStorage.getItem('crud-output-last');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setValue(parsed);
            } catch (e) {
                setValue(saved);
            }
        } else {
            alert('No saved output found');
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden gap-2">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-md font-bold text-gray-200 flex items-center gap-2">
                    <i className="fas fa-terminal text-sm"></i>
                    Response
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="p-1 text-md text-gray-500 hover:text-white transition-colors"
                        title="Save to LocalStorage"
                    >
                        <i className="fas fa-save"></i>
                    </button>
                    <button
                        onClick={handleLoad}
                        className="p-1 text-md text-gray-500 hover:text-white transition-colors"
                        title="Load from LocalStorage"
                    >
                        <i className="fas fa-upload"></i>
                    </button>
                    <button
                        onClick={() => setShowCode(true)}
                        className="p-1 text-md text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                        <i className="fas fa-code"></i>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-1 relative">
                <pre
                    ref={contentRef}
                    className="w-full text-gray-300 whitespace-pre-wrap leading-relaxed text-[14px] font-mono"
                    style={{ lineHeight: "1.1" }}
                    dangerouslySetInnerHTML={{ __html: content }}
                ></pre>
            </div>
            
            <CodeExample isOpen={showCode} onClose={() => setShowCode(false)} />
        </div>
    );
}
