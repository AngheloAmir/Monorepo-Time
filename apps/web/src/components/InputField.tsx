interface InputFieldProps {
    label : string;
    icon : string;
    placeholder : string;
    value : string;
    onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({label, icon, placeholder, value, onChange}: InputFieldProps) {
    return (
        <div className="flex flex-col gap-2 w-full m-0 p-0">
            <label className="text-xs tracking-wider">
                {label}
            </label>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className={`${icon} text-blue-500/50 group-focus-within:text-green-500 transition-colors text-md`}></i>
                </div>
                <input
                    type="text"
                    className="pl-10 text-sm w-full bg-gray-900/70 border border-gray-600 rounded p-2 text-gray-400 flex-1"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        onChange(e);
                    }}
                />
            </div>
        </div>
    )
}