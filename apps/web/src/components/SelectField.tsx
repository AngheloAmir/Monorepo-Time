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
                        <select
                            value={value}
                            onChange={onChange}
                            className="appearance-none pl-3 pr-10 py-2.5 text-sm w-full bg-transparent text-gray-200 placeholder-gray-600 focus:outline-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-gray-900 text-gray-500">
                                {placeholder}
                            </option>
                            {options.map((opt, index) => {
                                const optionLabel = typeof opt === 'string' ? opt : opt.label;
                                const optionValue = typeof opt === 'string' ? opt : (opt.value || opt.path || '');
                                return (
                                    <option key={index} value={optionValue} className="bg-[#0A0A0A] text-gray-300">
                                        {optionLabel}
                                    </option>
                                );
                            })}
                        </select>
                        {/* Right Arrow Icon */}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <i className="fas fa-chevron-down text-gray-500 group-focus-within:text-blue-400 text-xs transition-colors"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
