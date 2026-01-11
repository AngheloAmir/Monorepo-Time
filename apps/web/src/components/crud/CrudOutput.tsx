import { useEffect, useRef, useState } from 'react';

interface CrudOutputProps {
    output: any;
    onShowCode?: () => void;
}

export default function CrudOutput({ output, onShowCode }: CrudOutputProps) {
    const [content, setContent] = useState<string>('');
    const contentRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        setValue(output);
    }, [output]);

    const setValue = (val: any) => {
        let stringVal = '';
        if (typeof val === 'object') {
            stringVal = JSON.stringify(val, null, 2);
        } else {
            stringVal = String(val);
        }
        
        // Basic Syntax Highlighting Logic
        let html = stringVal
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Keys: "key": -> green
        html = html.replace(/"([^"]+)":/g, '<span class="text-green-500">"$1"</span>:');
        
        // Punctuation: [ ] { } , -> orange
        // Note: avoiding replacing inside spans is tricky with regex. 
        // A safer robust way would be a tokenizer, but adapting the simple regex from original js:
        // The original JS script used a simple replace for punctuation which might arguably hit content in strings.
        // For faithful reproduction we stick to simple logic but maybe safer order.
        
        // Actually, the original JS was: html.replace(/([{}\[\],])/g, '<span class="text-orange-500">$1</span>');
        // This runs AFTER key replacement, so it might break the <span ...> tags if they contain those chars (unlikely for class/style, but possible).
        // Let's stick to setting innerHTML with the highlighting.
        
        // Re-coloring punctuation
        html = html.replace(/([{}\[\],])/g, (match) => {
             // Avoid replacing if it's part of a span tag? 
             // Simple hack: minimal replacement.
             return `<span class="text-orange-500">${match}</span>`;
        });
        
        setContent(html);
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
                // Note: we are only updating the view locally, not the parent 'output' prop.
                // Depending on design, we might want to notify parent, but original JS just did setVal on element.
            } catch (e) {
                setValue(saved);
            }
        } else {
            alert('No saved output found');
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent text-sm font-mono border border-gray-700/50 rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-3 h-9 flex-none bg-gray-800 border-b border-gray-700">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Output</span>
                <div className="flex gap-1 transition-opacity">
                    <button 
                        onClick={handleSave}
                        className="w-16 py-0.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors text-[12px]"
                    >
                        Save
                    </button>
                    <button 
                        onClick={handleLoad}
                        className="w-16 py-0.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors text-[12px]"
                    >
                        Load
                    </button>
                    <button 
                        onClick={onShowCode}
                        className="w-24 py-0.5 rounded bg-gray-900 border border-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-200 transition-colors text-[12px] ml-2 flex items-center justify-center gap-1"
                    >
                        <i className="fas fa-code"></i> Show Code
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-2 group bg-gray-900/50">
                <pre 
                    ref={contentRef}
                    className="w-full text-white whitespace-pre-wrap leading-tight text-[13px]" 
                    dangerouslySetInnerHTML={{ __html: content }}
                ></pre>
            </div>
        </div>
    );
}
