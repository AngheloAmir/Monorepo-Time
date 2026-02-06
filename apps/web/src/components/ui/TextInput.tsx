interface InputFieldProps {
    label : string;
    placeholder : string;
    value : string;
    onChange : (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
}

export default function TextInput({label, placeholder, value, onChange, rows = 4}: InputFieldProps) {
    return (
        <div className="flex flex-col gap-2 w-full m-0 p-0 group/input">
            <label className="text-xs font-bold tracking-wider text-gray-400 group-focus-within/input:text-blue-400 transition-colors uppercase">
                {label}
            </label>

            <div className="relative group rounded-lg transition-all duration-300">
                {/* Border Wrapper */}
                <div className={`relative p-[1px] rounded-lg bg-gradient-to-r 
                    from-gray-700/40 to-gray-800/40 
                    group-focus-within:from-blue-500/40 
                    group-focus-within:to-purple-600/40
                    transition-colors duration-300`}>
                    <div className="relative bg-gray/[0.1] rounded flex items-center overflow-hidden">
                        <textarea
                            className="pl-3 pr-4 py-2.5 text-sm w-full text-white placeholder-gray-600 focus:outline-none resize-none"
                            rows={rows}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                                onChange(e);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}