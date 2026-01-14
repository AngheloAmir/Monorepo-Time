import { useState, useEffect } from "react";
import useCrudState from "../../_context/crud";
import type { CrudItem } from "types";

interface CrudEditProps {
    isOpen: boolean;
    onClose: () => void;
    categoryIndex: number;
    itemIndex: number;
}

export default function CrudEdit({ isOpen, onClose, categoryIndex, itemIndex }: CrudEditProps) {
    const crudData = useCrudState.use.crudData();
    const setCrudData = useCrudState.use.setCrudData();

    const [label, setLabel] = useState("");
    const [route, setRoute] = useState("");
    const [method, setMethod] = useState("");
    const [description, setDescription] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [expectedOutcome, setExpectedOutcome] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (itemIndex === -1) {
                // Add new item mode
                setLabel("");
                setRoute("");
                setMethod("GET");
                setDescription("");
                setSampleInput("{}");
                setExpectedOutcome("");
            } else if (crudData[categoryIndex] && crudData[categoryIndex].items[itemIndex]) {
                // Edit mode
                const item = crudData[categoryIndex].items[itemIndex];
                setLabel(item.label);
                setRoute(item.route);
                setMethod(item.methods);
                setDescription(item.description);
                setSampleInput(item.sampleInput);
                setExpectedOutcome(item.expectedOutcome);
            }
        }
    }, [isOpen, crudData, categoryIndex, itemIndex]);

    const handleSave = () => {
        const newData = [...crudData];
        const newItem: CrudItem = {
            label,
            route,
            methods: method,
            description,
            sampleInput,
            expectedOutcome,
            suggested: [],
        };

        if (itemIndex === -1) {
             if (!newData[categoryIndex].items) newData[categoryIndex].items = [];
             newData[categoryIndex].items.push(newItem);
        } else {
             const existing = newData[categoryIndex].items[itemIndex];
             newData[categoryIndex].items[itemIndex] = { ...existing, ...newItem };
        }
        
        setCrudData(newData);
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">{itemIndex === -1 ? 'Add New Item' : 'Edit CRUD Item'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
                    {/* Label */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Label</label>
                        <input 
                            type="text" 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                         {/* Route */}
                        <div className="col-span-2 flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Route</label>
                            <input 
                                type="text" 
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                value={route}
                                onChange={(e) => setRoute(e.target.value)}
                            />
                        </div>
                        {/* Method */}
                        <div className="col-span-1 flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Method</label>
                            <input 
                                type="text" 
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                        <textarea 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors h-20 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Sample Input */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sample Input (JSON)</label>
                        <textarea 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                            value={sampleInput}
                            onChange={(e) => setSampleInput(e.target.value)}
                        />
                    </div>

                    {/* Expected Outcome */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected Outcome (Markdown)</label>
                        <textarea 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                            value={expectedOutcome}
                            onChange={(e) => setExpectedOutcome(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
