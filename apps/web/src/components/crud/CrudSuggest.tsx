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
                return `<span class="text-blue-500 font-bold">${result}</span>`;
            } else {
                // Apply normal highlighting
                let hl = result;
                hl = hl.replace(/"([^"]+)":/g, '<span class="text-green-500">"$1"</span>:');
                hl = hl.replace(/([{}\[\],])/g, '<span class="text-orange-500">$1</span>');
                return hl;
            }
        }).join('\n');

        setHtmlContent(processed);
    }, [value]);

    return (
        <div className="flex flex-col h-full bg-transparent text-sm font-mono transition-all duration-300 border border-gray-700/50 rounded-md overflow-hidden">
            <div className={`flex items-center ${isMinimized ? 'justify-center px-0' : 'justify-between px-3'} h-9 flex-none border-b border-gray-700 bg-gray-800 transition-all`}>
                {!isMinimized && (
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-xs whitespace-nowrap">
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
                <div className="flex-1 overflow-auto custom-scrollbar p-2 bg-gray-900/50">
                    <pre 
                        className="w-full text-white whitespace-pre-wrap leading-tight text-[13px]" 
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    ></pre>
                </div>
            )}
        </div>
    );
}
