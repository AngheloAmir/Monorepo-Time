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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
             {/* Gradient Background Border */}
             <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
             
            <div className="relative bg-[#0A0A0A] border border-gray-800 rounded-2xl shadow-2xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden">
                {/* Neon Glow */}
                 <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 bg-[#0A0A0A] relative z-10">
                    <h3 className="font-bold text-white text-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <i className={`fas ${initialData ? 'fa-edit' : 'fa-plus'}`}></i>
                        </div>
                        {initialData ? 'Edit Route' : 'Create New Route'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        
                        {/* Row 1: Method | Availability | Route */}
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-3 flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Method</label>
                                <select 
                                    className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white text-sm appearance-none cursor-pointer hover:border-gray-600 transition-colors"
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
                            <div className="col-span-3 flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Availability</label>
                                <select 
                                    className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white text-sm appearance-none cursor-pointer hover:border-gray-600 transition-colors"
                                    value={formData.availableFor}
                                    onChange={(e) => handleChange('availableFor', e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="authenticated">Authenticated</option>
                                </select>
                            </div>
                            <div className="col-span-6 flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Route</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono">/</span>
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-3 focus:border-blue-500 outline-none text-blue-400 font-mono text-sm placeholder-gray-700 transition-all focus:ring-1 focus:ring-blue-500/20"
                                        placeholder="api/v1/resource"
                                        value={formData.route.startsWith('/') ? formData.route.substring(1) : formData.route}
                                        onChange={(e) => handleChange('route', '/' + e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Label | Description */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
                             <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Label</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white text-sm transition-all focus:ring-1 focus:ring-blue-500/20"
                                    value={formData.label}
                                    onChange={(e) => handleChange('label', e.target.value)}
                                    placeholder="e.g. Fetch Users"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <input 
                                    type="text" 
                                    className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:border-blue-500 outline-none text-white text-sm transition-all focus:ring-1 focus:ring-blue-500/20"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Brief description of what this endpoint does..."
                                />
                            </div>
                        </div>

                        {/* JSON Editors Area */}
                        <div className="grid grid-cols-2 gap-6 h-[280px]">
                            {/* Sample Input */}
                            <div className="flex flex-col gap-2 h-full">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sample Input (JSON)</label>
                                <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                                    <textarea 
                                        className="w-full h-full bg-transparent p-4 resize-none outline-none text-gray-300 font-mono text-sm custom-scrollbar leading-relaxed"
                                        value={formData.sampleInput}
                                        onChange={(e) => handleChange('sampleInput', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Expected Outcome */}
                            <div className="flex flex-col gap-2 h-full">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Expected Outcome</label>
                                <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                                    <textarea 
                                        className="w-full h-full bg-transparent p-4 resize-none outline-none text-gray-300 font-mono text-sm custom-scrollbar leading-relaxed"
                                        value={formData.expectedOutcome}
                                        onChange={(e) => handleChange('expectedOutcome', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        
                        {/* Suggested Inputs */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Suggested Presets</label>
                                <button 
                                    type="button" 
                                    onClick={addSuggestion}
                                    className="text-xs bg-gray-800 hover:bg-blue-600 hover:text-white text-blue-400 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-blue-500 transition-all font-bold"
                                >
                                    <i className="fas fa-plus mr-1"></i> Add Preset
                                </button>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-2 min-h-[120px] max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col gap-2">
                                {formData.suggested.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-600 gap-2 opacity-50">
                                        <i className="fas fa-box-open text-2xl"></i>
                                        <span className="text-sm font-medium">No presets added yet.</span>
                                    </div>
                                ) : (
                                    formData.suggested.map((suggestion, idx) => (
                                        <div key={idx} className="bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 flex flex-col gap-3 group hover:border-gray-600 transition-colors">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-mono">
                                                     {idx + 1}
                                                 </div>
                                                <input 
                                                    type="text" 
                                                    className="bg-transparent border-b border-gray-700 text-sm text-white flex-1 focus:border-blue-500 outline-none pb-1 transition-colors font-bold" 
                                                    placeholder="Preset Name" 
                                                    value={suggestion.name}
                                                    onChange={(e) => handleSuggestionChange(idx, 'name', e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="bg-transparent border-b border-gray-700 text-sm text-blue-400 font-mono flex-1 focus:border-blue-500 outline-none pb-1 transition-colors" 
                                                    placeholder="?url=params" 
                                                    value={suggestion.urlparams}
                                                    onChange={(e) => handleSuggestionChange(idx, 'urlparams', e.target.value)}
                                                />
                                                <button 
                                                    type="button" 
                                                    className="text-gray-600 hover:text-red-500 p-2 transition-colors rounded-lg hover:bg-white/5" 
                                                    title="Remove"
                                                    onClick={() => removeSuggestion(idx)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                            <textarea 
                                                className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-300 h-24 w-full resize-y focus:border-blue-500 outline-none leading-relaxed" 
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
                <div className="px-8 py-5 border-t border-gray-800 bg-[#0A0A0A] flex items-center relative z-10">
                     {itemIndex !== -1 && (
                         <button 
                             type="button" 
                             onClick={handleDeleteClick}
                             className="mr-auto px-4 py-2.5 rounded-xl text-sm text-red-500 hover:text-white hover:bg-red-600 transition-colors font-bold flex items-center gap-2"
                         >
                            <i className="fas fa-trash"></i> Delete
                         </button>
                     )}

                     <div className="flex gap-4 ml-auto">
                         <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                         <button 
                            onClick={handleSaveClick} 
                            className="group relative px-8 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden transition-all hover:scale-105 shadow-lg shadow-blue-600/25"
                        >
                             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <span className="relative z-10">Save Route</span>
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
}
