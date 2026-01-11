import { useEffect, useState } from 'react';

interface CrudInputEditorProps {
    title: string;
    initialValue?: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
}

export default function CrudInputEditor({ title, initialValue = '{}', onChange, readOnly = false }: CrudInputEditorProps) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onChange) onChange(newValue);
    };

    return (
        <div className="flex flex-col h-full bg-[#0F0F0F] overflow-hidden shadow-sm transition-all hover:border-gray-700 group">
            <div className="px-4 h-10 flex items-center flex-none bg-gray-900/50 border-b border-gray-800 group-hover:bg-gray-900 transition-colors">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px] group-hover:text-gray-300 transition-colors flex items-center gap-2">
                    <i className="fas fa-code text-[10px]"></i>
                    {title}
                </span>
            </div>
            <div className="flex-1 relative">
                <textarea
                    className="absolute inset-0 w-full h-full bg-transparent text-gray-300 p-3 resize-none outline-none font-mono text-[12px] leading-relaxed custom-scrollbar selection:bg-blue-500/30"
                    value={value}
                    onChange={handleChange}
                    spellCheck={false}
                    readOnly={readOnly}
                    placeholder="{ ... }"
                />
            </div>
        </div>
    );
}
