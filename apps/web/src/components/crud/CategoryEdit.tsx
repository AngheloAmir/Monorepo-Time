import { useState, useEffect } from "react";
import useCrudState from "../../_context/crud";
import type { CrudCategory } from "types";

interface CategoryEditProps {
    isOpen: boolean;
    onClose: () => void;
    categoryIndex: number; // -1 for new category
}

export default function CategoryEdit({ isOpen, onClose, categoryIndex }: CategoryEditProps) {
    const crudData = useCrudState.use.crudData();
    const setCrudData = useCrudState.use.setCrudData();

    const [categoryName, setCategoryName] = useState("");
    const [devUrl, setDevUrl] = useState("http://localhost:3000");
    const [prodUrl, setProdUrl] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (categoryIndex === -1) {
                // Add new category
                setCategoryName("");
                setDevUrl("http://localhost:3000");
                setProdUrl("");
            } else if (crudData[categoryIndex]) {
                // Edit existing category
                const cat = crudData[categoryIndex];
                setCategoryName(cat.category);
                setDevUrl(cat.devurl);
                setProdUrl(cat.produrl);
            }
        }
    }, [isOpen, crudData, categoryIndex]);

    const handleSave = () => {
        const newData = [...crudData];
        
        if (categoryIndex === -1) {
            const newCategory: CrudCategory = {
                category: categoryName,
                devurl: devUrl,
                produrl: prodUrl,
                items: []
            };
            newData.push(newCategory);
        } else {
            newData[categoryIndex] = {
                ...newData[categoryIndex],
                category: categoryName,
                devurl: devUrl,
                produrl: prodUrl
            };
        }
        
        setCrudData(newData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-md flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">
                        {categoryIndex === -1 ? 'Add New Category' : 'Edit Category'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {/* Category Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
                        <input 
                            type="text" 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="e.g., User Management"
                        />
                    </div>

                    {/* Dev URL */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dev URL</label>
                        <input 
                            type="text" 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={devUrl}
                            onChange={(e) => setDevUrl(e.target.value)}
                            placeholder="http://localhost:3000"
                        />
                    </div>

                    {/* Prod URL */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prod URL</label>
                        <input 
                            type="text" 
                            className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={prodUrl}
                            onChange={(e) => setProdUrl(e.target.value)}
                            placeholder="https://api.example.com"
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
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
