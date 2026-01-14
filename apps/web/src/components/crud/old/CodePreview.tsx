import { useEffect, useState } from 'react';
import useCrudState from '../../../_context/crud';

export default function CodePreview() {
    const isCodePreviewOpen = useCrudState.use.isCodePreviewOpen();
    const setIsCodePreviewOpen = useCrudState.use.setIsCodePreviewOpen();
    const crudData = useCrudState.use.crudData();
    const selectedRoute = useCrudState.use.selectedRoute();
    const activeParams = useCrudState.use.activeParams();
    const activeHeaders = useCrudState.use.activeHeaders();
    const activeBody = useCrudState.use.activeBody();
    const useProd = useCrudState.use.useProd();

    const selectedItem = selectedRoute && crudData[selectedRoute.catIndex]?.items[selectedRoute.itemIndex];
    const activeCategory = selectedRoute && crudData[selectedRoute.catIndex];
    
    // Fallbacks
    const item = selectedItem || null;
    const paramValue = activeParams;
    const headerValue = activeHeaders;
    const bodyValue = activeBody;
    const devUrl = activeCategory?.devurl || '';
    const prodUrl = activeCategory?.produrl || '';
    
    const [codeHtml, setCodeHtml] = useState('');

    useEffect(() => {
        if (isCodePreviewOpen && item) {
            generateCode();
        }
    }, [isCodePreviewOpen, item, paramValue, headerValue, bodyValue, useProd]);

    const generateCode = () => {
        if (!item) return;

        const root = useProd ? prodUrl : devUrl;
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

    if (!isCodePreviewOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
             {/* Gradient Background Border */}
             <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
             
            <div className="relative bg-[#0A0A0A] border border-gray-800 rounded-2xl shadow-2xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden">
                {/* Neon Glow */}
                 <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-[#0A0A0A] relative z-10">
                    <h3 className="font-bold text-white text-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <i className="fas fa-code"></i>
                        </div>
                        Code Preview
                    </h3>
                    <button onClick={() => setIsCodePreviewOpen(false)} className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-0 overflow-hidden relative z-10 bg-[#050505]">
                    <div className="h-full overflow-auto custom-scrollbar p-6">
                        <pre className="font-mono text-sm text-gray-300 whitespace-pre leading-relaxed" dangerouslySetInnerHTML={{ __html: codeHtml }}>
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-800 bg-[#0A0A0A] flex justify-end items-center relative z-10 box-border">
                    <button 
                        onClick={() => {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = codeHtml;
                            const text = tempDiv.textContent || tempDiv.innerText || '';
                            navigator.clipboard.writeText(text);
                            // Could show toast here
                        }}
                        className="group relative px-6 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
                    >
                         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                         <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <span className="relative z-10 flex items-center gap-2">
                             <i className="fas fa-copy"></i>
                             Copy to Clipboard
                         </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
