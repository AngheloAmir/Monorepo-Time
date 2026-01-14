import { useEffect, useRef, useState } from 'react';
import useCrudState from '../../_context/crud';

export default function CrudExpectedOutput() {
    const expectedOutput = useCrudState.use.expectedOutput();
    const contentRef    = useRef<HTMLPreElement>(null);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        setValue(expectedOutput);
    }, [expectedOutput]);

    const setValue = (val: any) => {
        try {
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
        } catch (error) {
            setContent("Invalid output");
        }
    };


    return (
        <div className="flex flex-col h-full overflow-hidden gap-2">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="text-md font-bold text-gray-200 flex items-center gap-2">
                    <i className="fa fa-circle-info text-sm"></i>
                    Expected Response
                </h2>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-1 relative">
                <pre
                    ref={contentRef}
                    className="w-full text-gray-300 whitespace-pre-wrap leading-relaxed text-[14px] font-mono"
                    dangerouslySetInnerHTML={{ __html: content }}
                ></pre>
            </div>
        </div>
    );
}
