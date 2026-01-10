import React from 'react';

interface SelectOption {
    label: string;
    value?: string;
    path?: string;
}

interface SelectFieldProps {
    label: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: (string | SelectOption)[];
    placeholder?: string;
}

export default function SelectField({ label, icon, value, onChange, options, placeholder = "Select an option" }: SelectFieldProps) {
    return (
        <div className="flex flex-col gap-2 w-full m-0 p-0">
            <label className="text-xs tracking-wider text-gray-400">
                {label}
            </label>

            <div className="relative group">
                {/* Left Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <i className={`${icon} text-blue-500/50 group-focus-within:text-green-500 transition-colors text-md`}></i>
                </div>

                <select
                    value={value}
                    onChange={onChange}
                    className="appearance-none pl-10 pr-10 text-sm w-full bg-gray-900/70 border border-gray-600 rounded p-2 text-gray-400 flex-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt, index) => {
                        const optionLabel = typeof opt === 'string' ? opt : opt.label;
                        const optionValue = typeof opt === 'string' ? opt : (opt.value || opt.path || '');
                        return (
                            <option key={index} value={optionValue} className="bg-gray-800 text-gray-300">
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>

                {/* Right Arrow Icon */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
                </div>
            </div>
        </div>
    );
}
