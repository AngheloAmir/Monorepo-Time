import { useEffect, useState } from 'react';
import type { CrudItem } from './types';

interface CodePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    item: CrudItem | null;
    paramValue: string;
    headerValue: string;
    bodyValue: string;
    devUrl: string;
    prodUrl: string;
    useProd: boolean;
}

export default function CodePreview({ 
    isOpen, 
    onClose, 
    item, 
    paramValue, 
    headerValue, 
    bodyValue,
    devUrl,
    prodUrl,
    useProd
}: CodePreviewProps) {
    const [codeHtml, setCodeHtml] = useState('');

    useEffect(() => {
        if (isOpen && item) {
            generateCode();
        }
    }, [isOpen, item, paramValue, headerValue, bodyValue, useProd]);

    const generateCode = () => {
        if (!item) return;

        const root = useProd ? prodUrl : devUrl;
        // ensure paramValue starts with ? or is empty handled by logic? Original just appended.
        // Original: const params = window.crudState.paramValue || '';
        const params = paramValue || '';
        const url = `${root}${item.route}${params}`;
        
        const method = item.methods || 'GET';
        const isStream = method === 'STREAM';
        const fetchMethod = isStream ? 'GET' : method;

        const headerVal = headerValue || '{}';
        const bodyVal = bodyValue || '{}';

        // Helper for coloring
        const kw = (t: string) => `<span class="text-pink-400 font-bold">${t}</span>`;
        const str = (t: string) => `<span class="text-yellow-300">"${t}"</span>`;
        const func = (t: string) => `<span class="text-green-400">${t}</span>`;
        const comment = (t: string) => `<span class="text-gray-500 italic">${t}</span>`;
        
        const indent = "    ";
        let code = '';
        
        if (isStream) {
            code += `${kw('const')} response = ${kw('await')} ${func('fetch')}(${str(url)}, {\n`;
            code += `${indent}method: ${str(fetchMethod)},\n`;
            code += `${indent}headers: ${headerVal.replace(/\n/g, '\n' + indent)},\n`;
            code += `});\n\n`;
            
            code += `${comment('// Handle Stream')}\n`;
            code += `${kw('const')} reader = response.body.${func('getReader')}();\n`;
            code += `${kw('const')} decoder = ${kw('new')} ${func('TextDecoder')}(${str('utf-8')});\n\n`;
            code += `${kw('while')} (${kw('true')}) {\n`;
            code += `${indent}${kw('const')} { done, value } = ${kw('await')} reader.${func('read')}();\n`;
            code += `${indent}${kw('if')} (done) ${kw('break')};\n`;
            code += `${indent}${kw('const')} chunk = decoder.${func('decode')}(value, { stream: ${kw('true')} });\n`;
            code += `${indent}${func('console')}.${func('log')}(chunk);\n`;
            code += `}`;
            
        } else {
            code += `${kw('const')} response = ${kw('await')} ${func('fetch')}(${str(url)}, {\n`;
            code += `${indent}method: ${str(fetchMethod)},\n`;
            
            // Format Headers
            let formattedHeaders = headerVal.trim();
            if (formattedHeaders.includes('\n')) {
                 formattedHeaders = formattedHeaders.split('\n').map((line, i) => i === 0 ? line : indent + line).join('\n');
            }
            code += `${indent}headers: ${formattedHeaders},\n`;

            if (fetchMethod !== 'GET' && fetchMethod !== 'HEAD') {
                 let formattedBody = bodyVal.trim();
                 try {
                     const j = JSON.parse(formattedBody);
                     formattedBody = JSON.stringify(j, null, 4);
                     formattedBody = formattedBody.split('\n').map((line, i) => i === 0 ? line : indent + line).join('\n');
                 } catch(e) {}
                 
                 code += `${indent}body: ${func('JSON')}.${func('stringify')}(${formattedBody})\n`;
            }

            code += `});\n\n`;
            code += `${kw('const')} data = ${kw('await')} response.${func('json')}();\n`;
            code += `${func('console')}.${func('log')}(data);`;
        }

        setCodeHtml(code);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90%] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-code text-blue-400"></i>
                        <h3 className="text-white font-bold text-lg">Code Preview</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-gray-950">
                    <pre className="font-mono text-sm text-gray-300 whitespace-pre leading-relaxed" dangerouslySetInnerHTML={{ __html: codeHtml }}>
                    </pre>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-700 bg-gray-800 flex justify-end rounded-b-lg">
                    <button 
                        onClick={() => {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = codeHtml;
                            const text = tempDiv.textContent || tempDiv.innerText || '';
                            navigator.clipboard.writeText(text);
                            // Could show toast here
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-2 transition-colors"
                    >
                        <i className="fas fa-copy"></i>
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </div>
    );
}
