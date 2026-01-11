import { useEffect, useState } from 'react';
import type { CrudItem, Suggestion } from './types';

interface CrudEditorProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: CrudItem;
    categoryIndex: number;
    itemIndex: number;
    onSave: (data: CrudItem, catIndex: number, itemIndex: number, action: 'add' | 'update') => Promise<void>;
    onDelete: (catIndex: number, itemIndex: number) => Promise<void>;
}

export default function CrudEditor({ 
    isOpen, 
    onClose, 
    initialData, 
    categoryIndex, 
    itemIndex, 
    onSave, 
    onDelete 
}: CrudEditorProps) {
    const defaultData: CrudItem = {
        label: '',
        route: '',
        methods: 'GET',
        description: '',
        sampleInput: '{}',
        suggested: [],
        expectedOutcome: '',
        availableFor: 'public'
    };

    const [formData, setFormData] = useState<CrudItem>(defaultData);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData(defaultData);
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (field: keyof CrudItem, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSuggestionChange = (index: number, field: keyof Suggestion, value: string) => {
        const newSuggested = [...formData.suggested];
        newSuggested[index] = { ...newSuggested[index], [field]: value };
        setFormData(prev => ({ ...prev, suggested: newSuggested }));
    };

    const addSuggestion = () => {
        setFormData(prev => ({
            ...prev,
            suggested: [...prev.suggested, { name: 'New Suggestion', urlparams: '', content: '{}' }]
        }));
    };

    const removeSuggestion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            suggested: prev.suggested.filter((_, i) => i !== index)
        }));
    };

    const handleSaveClick = async () => {
        const action = itemIndex === -1 ? 'add' : 'update';
        await onSave(formData, categoryIndex, itemIndex, action);
        onClose();
    };

    const handleDeleteClick = async () => {
        if (window.confirm("Delete method can only be reversed by GIT, continue?")) {
            await onDelete(categoryIndex, itemIndex);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-[800px] max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                    <h3 className="font-medium text-white text-lg">{initialData ? 'Edit CRUD Item' : 'Create New Route'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                    <form className="flex flex-col gap-4 text-sm text-gray-300" onSubmit={(e) => e.preventDefault()}>
                        
                        {/* Row 1: Method | Availability | Route */}
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 w-[120px] flex-none">
                                <label className="text-xs font-bold text-gray-500 uppercase">Method</label>
                                <select 
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-white h-[38px] text-sm"
                                    value={formData.methods}
                                    onChange={(e) => handleChange('methods', e.target.value)}
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="PATCH">PATCH</option>
                                    <option value="STREAM">STREAM</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 w-[200px] flex-none">
                                <label className="text-xs font-bold text-gray-500 uppercase">Availability</label>
                                <select 
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-white h-[38px] text-sm"
                                    value={formData.availableFor}
                                    onChange={(e) => handleChange('availableFor', e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="authenticated">Authenticated</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Route</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-blue-400 font-mono h-[38px] text-sm"
                                    value={formData.route}
                                    onChange={(e) => handleChange('route', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Row 2: Label | Description */}
                        <div className="grid grid-cols-[1fr_2fr] gap-4">
                             <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Label</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-white h-[38px] text-sm"
                                    value={formData.label}
                                    onChange={(e) => handleChange('label', e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-white h-[38px] text-sm"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* JSON Editors Area */}
                        <div className="grid grid-cols-2 gap-4 h-[240px]">
                            {/* Sample Input */}
                            <div className="flex flex-col gap-1 h-full">
                                <label className="font-bold text-gray-500 uppercase flex justify-between text-xs">
                                    <span>Sample Input (JSON)</span>
                                </label>
                                <textarea 
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-white font-mono text-sm resize-none custom-scrollbar leading-none"
                                    value={formData.sampleInput}
                                    onChange={(e) => handleChange('sampleInput', e.target.value)}
                                ></textarea>
                            </div>

                            {/* Expected Outcome */}
                            <div className="flex flex-col gap-1 h-full">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-gray-500 uppercase text-xs">Expected Outcome</label>
                                </div>
                                <textarea 
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:border-blue-500 outline-none text-white font-mono text-sm resize-none custom-scrollbar leading-none"
                                    value={formData.expectedOutcome}
                                    onChange={(e) => handleChange('expectedOutcome', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        
                        {/* Suggested Inputs (UI Card List) */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-500 uppercase">Suggested Inputs</label>
                                <button 
                                    type="button" 
                                    onClick={addSuggestion}
                                    className="text-sm bg-gray-800 hover:bg-gray-700 text-blue-400 px-2 py-1 rounded border border-gray-700 transition-colors"
                                >
                                    <i className="fas fa-plus mr-1"></i> Add Suggestion
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-3 p-2 bg-gray-900/50 rounded border border-gray-800 min-h-[100px] max-h-[300px] overflow-y-auto custom-scrollbar">
                                {formData.suggested.length === 0 ? (
                                    <div className="text-center text-gray-600 italic text-sm py-4">No suggestions added.</div>
                                ) : (
                                    formData.suggested.map((suggestion, idx) => (
                                        <div key={idx} className="suggestion-card bg-gray-800 border border-gray-700 rounded p-2 flex flex-col gap-2 relative group">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="text" 
                                                    className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white flex-1 focus:border-blue-500 outline-none" 
                                                    placeholder="Name" 
                                                    value={suggestion.name}
                                                    onChange={(e) => handleSuggestionChange(idx, 'name', e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-blue-300 font-mono flex-1 focus:border-blue-500 outline-none" 
                                                    placeholder="?url=params" 
                                                    value={suggestion.urlparams}
                                                    onChange={(e) => handleSuggestionChange(idx, 'urlparams', e.target.value)}
                                                />
                                                <button 
                                                    type="button" 
                                                    className="text-red-500 hover:text-red-400 p-1 opacity-50 group-hover:opacity-100 transition-opacity" 
                                                    title="Remove"
                                                    onClick={() => removeSuggestion(idx)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                            <textarea 
                                                className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm font-mono text-green-300 h-32 w-full resize-y focus:border-blue-500 outline-none leading-none" 
                                                placeholder="{ JSON Content }"
                                                value={suggestion.content}
                                                onChange={(e) => handleSuggestionChange(idx, 'content', e.target.value)}
                                            ></textarea>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-800 flex items-center bg-gray-900/50">
                     {itemIndex !== -1 && (
                         <button 
                             type="button" 
                             onClick={handleDeleteClick}
                             className="mr-auto px-4 py-2 rounded-lg text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                         >
                            <i className="fas fa-trash mr-1"></i> Delete
                         </button>
                     )}

                     <div className="flex gap-2 ml-auto">
                         <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                         <button onClick={handleSaveClick} className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-colors">Save Changes</button>
                     </div>
                </div>
            </div>
        </div>
    );
}
