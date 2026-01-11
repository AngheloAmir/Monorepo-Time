import { useEffect, useState } from 'react';

interface CrudSuggestProps {
    value: string | object;
    onToggleSize?: () => void;
    isMinimized?: boolean;
}

export default function CrudSuggest({ value, onToggleSize, isMinimized = false }: CrudSuggestProps) {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        let valString = '';
        if (typeof value === 'object') {
            valString = JSON.stringify(value, null, 2);
        } else {
            valString = String(value);
        }

        const lines = valString.split('\n');
        const processed = lines.map(line => {
            const result = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            if (result.trim().startsWith('#')) {
                return `<span class="text-blue-400 font-bold opacity-80">${result}</span>`;
            } else {
                let hl = result;
                hl = hl.replace(/"([^"]+)":/g, '<span class="text-green-400">"$1"</span>:');
                hl = hl.replace(/([{}\[\],])/g, '<span class="text-gray-500">$1</span>');
                return hl;
            }
        }).join('\n');

        setHtmlContent(processed);
    }, [value]);

    return (
        <div className="flex flex-col h-full bg-[#0F0F0F] border border-gray-800 rounded-xl overflow-hidden shadow-sm transition-all hover:border-gray-700 group">
            <div className={`flex items-center ${isMinimized ? 'justify-center px-0' : 'justify-between px-4'} h-10 flex-none border-b border-gray-800 bg-gray-900/50 group-hover:bg-gray-900 transition-colors`}>
                {!isMinimized && (
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] group-hover:text-gray-300 transition-colors flex items-center gap-2">
                        <i className="fas fa-lightbulb text-[10px]"></i>
                        Expected Outcome
                    </span>
                )}
                <div className="flex gap-1">
                    <button 
                        onClick={onToggleSize}
                        className="text-gray-600 hover:text-white transition-colors w-6 h-6 flex items-center justify-center" 
                        title="Toggle Size"
                    >
                        <i className={`fas ${isMinimized ? 'fa-chevron-left' : 'fa-expand-alt'} text-[10px]`}></i>
                    </button>
                </div>
            </div>
            
            {!isMinimized && (
                <div className="flex-1 overflow-auto custom-scrollbar p-3">
                    <pre 
                        className="w-full text-gray-400 whitespace-pre-wrap leading-relaxed text-[12px] font-mono" 
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    ></pre>
                </div>
            )}
        </div>
    );
}
