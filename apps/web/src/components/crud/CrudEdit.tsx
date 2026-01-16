import { useState, useEffect } from "react";
import useCrudState from "../../appstates/crud";
import type { CrudItem } from "types";
import ModalBody from "../ui/ModalBody";
import ModalHeader from "../ui/ModalHeader";
import InputField from "../ui/InputField";
import TextInput from "../ui/TextInput";

interface CrudEditProps {
    isOpen: boolean;
    onClose: () => void;
    categoryIndex: number;
    itemIndex: number;
}

export default function CrudEdit({ isOpen, onClose, categoryIndex, itemIndex }: CrudEditProps) {
    const crudData = useCrudState.use.crudData();
    const setCrudData = useCrudState.use.setCrudData();
    const currentCategoryIndex = useCrudState.use.currentCategoryIndex();
    const currentCrudIndex = useCrudState.use.currentCrudIndex();
    const setCurrentCrudIndex = useCrudState.use.setCurrentCrudIndex();

    const [label, setLabel] = useState("");
    const [route, setRoute] = useState("");
    const [method, setMethod] = useState("");
    const [description, setDescription] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [expectedOutcome, setExpectedOutcome] = useState("");
    const [suggested, setSuggested] = useState<any[]>([]);

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
                setSuggested([]);
            } else if (crudData[categoryIndex] && crudData[categoryIndex].items[itemIndex]) {
                // Edit mode
                const item = crudData[categoryIndex].items[itemIndex];
                setLabel(item.label);
                setRoute(item.route);
                setMethod(item.methods);
                setDescription(item.description);
                setSampleInput(item.sampleInput);
                setExpectedOutcome(item.expectedOutcome);
                setSuggested(item.suggested || []);
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
            suggested,
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

    const handleDelete = () => {
        const newData = [...crudData];
        if (newData[categoryIndex] && newData[categoryIndex].items) {
            newData[categoryIndex].items.splice(itemIndex, 1);

            // Update selection if needed and if we are in the same category
            if (categoryIndex === currentCategoryIndex) {
                if (itemIndex === currentCrudIndex) {
                    setCurrentCrudIndex(-1);
                } else if (itemIndex < currentCrudIndex) {
                    setCurrentCrudIndex(currentCrudIndex - 1);
                }
            }

            setCrudData(newData);
            onClose();
        }
    };

    const addSuggestion = () => {
        setSuggested([...suggested, { name: "New Preset", urlparams: "", content: "{}" }]);
    };

    const updateSuggestion = (index: number, field: string, value: string) => {
        const newSuggested = [...suggested];
        newSuggested[index] = { ...newSuggested[index], [field]: value };
        setSuggested(newSuggested);
    };

    const deleteSuggestion = (index: number) => {
        const newSuggested = [...suggested];
        newSuggested.splice(index, 1);
        setSuggested(newSuggested);
    };

    if (!isOpen) return null;

    return (
        <ModalBody width="800px" >
            <ModalHeader
                title={itemIndex === -1 ? 'Add New Item' : 'Edit CRUD Item'}
                description={itemIndex === -1 ? 'Add a new item' : 'Edit an existing item'}
                icon={itemIndex === -1 ? 'fas fa-plus' : 'fas fa-edit'}
                close={onClose}
            />
            <div className="p-4 flex-1 flex flex-col gap-3 max-h-[60vh] overflow-y-auto text-md">
                <div className="flex gap-4">
                    <InputField
                        label="Label"
                        icon="fas fa-info"
                        placeholder="(optional) Description"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                    <InputField
                        label="Description"
                        icon="fas fa-info"
                        placeholder="(optional) Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <InputField
                        label="Route"
                        icon="fas fa-info"
                        placeholder="(optional) Description"
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                    />
                    <InputField
                        label="Method"
                        icon="fas fa-info"
                        placeholder="(optional) Description"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <TextInput
                        label="Sample Input"
                        placeholder="{}"
                        value={sampleInput}
                        onChange={(e) => setSampleInput(e.target.value)}
                        rows={5}
                    />
                    <TextInput
                        label="Expected Outcome"
                        placeholder="{}"
                        value={expectedOutcome}
                        onChange={(e) => setExpectedOutcome(e.target.value)}
                        rows={5}
                    />
                </div>

                {/* Suggested Presets */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Suggested Presets</label>
                    <div className="space-y-3">
                        {suggested.map((item, idx) => (
                            <div key={idx} className="flex flex-row gap-3">
                                <div className="w-[50%] flex flex-col gap-2">
                                    <div className="flex flex-row gap-2">
                                        <InputField
                                            label="Preset Name"
                                            icon="fas fa-info"
                                            placeholder="Preset Name"
                                            value={item.name}
                                            onChange={(e) => updateSuggestion(idx, 'name', e.target.value)}
                                        />
                                        <button onClick={() => deleteSuggestion(idx)} className="text-red-400 hover:text-red-300 px-2">
                                            <i className="pt-6 fas fa-trash"></i>
                                        </button>
                                    </div>

                                    <InputField
                                        label="URL Params"
                                        icon="fas fa-info"
                                        placeholder="URL Params"
                                        value={item.urlparams}
                                        onChange={(e) => updateSuggestion(idx, 'urlparams', e.target.value)}
                                    />
                                </div>
                                <div className="w-[50%]">
                                    <TextInput
                                        label="Body Content"
                                        placeholder="{}"
                                        value={item.content}
                                        onChange={(e) => updateSuggestion(idx, 'content', e.target.value)}
                                        rows={5}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addSuggestion}
                            className="w-full py-2 bg-white/5 border border-dashed border-white/20 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            + Add Preset
                        </button>
                    </div>
                </div>

            </div>

            <footer className="mt-2 mb-4 flex justify-between px-4">
                {categoryIndex !== -1 ? <button
                    onClick={handleDelete}
                    className="group relative px-6 py-2 rounded-lg font-medium text-sm text-red-400 hover:text-red-600 transition-colors overflow-hidden" >
                    Delete
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button> : <div></div>
                }

                <div className="flex gap-6">
                    <button
                        onClick={onClose}
                        className="group relative px-6 py-2 rounded-lg font-medium text-sm text-gray-400 hover:text-white transition-colors overflow-hidden">
                        <span className="relative z-10">Cancel</span>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    <button
                        onClick={handleSave}
                        className="group relative px-6 py-2 rounded-lg font-bold text-sm text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                        <span className="relative z-10 flex items-center gap-2">
                            <i className="fas fa-save"></i>
                            Save
                        </span>
                    </button>
                </div>
            </footer>
        </ModalBody>
    )
}
