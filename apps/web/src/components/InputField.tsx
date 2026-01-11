interface InputFieldProps {
    label : string;
    icon : string;
    placeholder : string;
    value : string;
    onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({label, icon, placeholder, value, onChange}: InputFieldProps) {
    return (
        <div className="flex flex-col gap-2 w-full m-0 p-0 group/input">
            <label className="text-xs font-bold tracking-wider text-gray-400 group-focus-within/input:text-blue-400 transition-colors uppercase">
                {label}
            </label>

            <div className="relative group rounded-lg transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10"></div>
                
                {/* Border Wrapper */}
                <div className="relative p-[1px] rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 group-focus-within:from-blue-500 group-focus-within:to-purple-600 transition-colors duration-300">
                    <div className="relative bg-[#0A0A0A] rounded-[7px] flex items-center overflow-hidden">
                        <div className="pl-3 flex items-center pointer-events-none">
                            <i className={`${icon} text-gray-500 group-focus-within:text-blue-400 transition-colors text-sm`}></i>
                        </div>
                        <input
                            type="text"
                            className="pl-3 pr-4 py-2.5 text-sm w-full bg-transparent text-gray-200 placeholder-gray-600 focus:outline-none"
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