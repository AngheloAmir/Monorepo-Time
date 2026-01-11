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
        <div className="flex flex-col h-full bg-transparent text-xs font-mono border border-gray-700/50 rounded-md overflow-hidden">
            <div className="bg-gray-800 px-3 h-9 flex items-center flex-none mb-0 border-b border-gray-700">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">{title}</span>
            </div>
            <div className="flex-1 relative bg-gray-900/50">
                <textarea
                    className="absolute inset-0 w-full h-full bg-transparent text-gray-300 p-2 resize-none outline-none font-mono text-[13px] leading-relaxed custom-scrollbar"
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
