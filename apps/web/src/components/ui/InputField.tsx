interface InputFieldProps {
    label : string;
    icon : string;
    placeholder : string;
    value : string;
    onChange : (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled? : boolean;
}

export default function InputField(props: InputFieldProps) {
    return (
        <div className="flex flex-col gap-2 w-full m-0 p-0 group/input">
            <label className="text-xs font-bold tracking-wider text-gray-400 group-focus-within/input:text-blue-400 transition-colors uppercase">
                {props.label}
            </label>

            <div className="relative group rounded-lg transition-all duration-300">
                {/* Border Wrapper */}
                <div className={`relative p-[1px] rounded-lg bg-gray-800 group-focus-within:bg-blue-600 transition-colors duration-300
                    ${props.disabled ? 'bg-transparent cursor-not-allowed' : ''}
                    `}>
                    <div className="relative bg-gray/[0.1] rounded flex items-center overflow-hidden">
                        <div className="pl-3 flex items-center pointer-events-none">
                            <i className={`${props.icon} text-gray-500 group-focus-within:text-blue-400 transition-colors text-sm`}></i>
                        </div>
                        <input
                            type="text"
                            className="pl-3 pr-4 py-2.5 text-sm w-full text-white placeholder-gray-600 focus:outline-none"
                            placeholder={props.placeholder}
                            value={props.value}
                            onChange={(e) => {
                                props.onChange(e);
                            }}
                            disabled={props.disabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}