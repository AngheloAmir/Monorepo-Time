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
        
        let html = stringVal
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Keys: "key": -> green
        html = html.replace(/"([^"]+)":/g, '<span class="text-green-400">"$1"</span>:');
        
        // Punctuation
        html = html.replace(/([{}\[\],])/g, (match) => {
             return `<span class="text-gray-500">${match}</span>`;
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
            } catch (e) {
                setValue(saved);
            }
        } else {
            alert('No saved output found');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0F0F0F] overflow-hidden shadow-sm transition-all hover:border-gray-700 group">
            <div className="flex items-center justify-between px-4 h-10 flex-none bg-gray-900/50 border-b border-gray-800 group-hover:bg-gray-900 transition-colors">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] group-hover:text-gray-300 transition-colors flex items-center gap-2">
                     <i className="fas fa-terminal text-[10px]"></i>
                    Output
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={handleSave}
                        className="p-1 text-[10px] text-gray-500 hover:text-white transition-colors"
                        title="Save to LocalStorage"
                    >
                        <i className="fas fa-save"></i>
                    </button>
                    <button 
                        onClick={handleLoad}
                        className="p-1 text-[10px] text-gray-500 hover:text-white transition-colors"
                        title="Load from LocalStorage"
                    >
                        <i className="fas fa-upload"></i>
                    </button>
                    <button 
                        onClick={onShowCode}
                        className="p-1 text-[10px] text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                        <i className="fas fa-code"></i>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-3 group relative">
                <pre 
                    ref={contentRef}
                    className="w-full text-gray-300 whitespace-pre-wrap leading-relaxed text-[12px] font-mono" 
                    dangerouslySetInnerHTML={{ __html: content }}
                ></pre>
            </div>
        </div>
    );
}
