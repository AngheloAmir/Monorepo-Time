import { useEffect, useState } from 'react';
import type { CrudCategory } from './types';

interface ManageCategoriesProps {
    isOpen: boolean;
    onClose: () => void;
    categories: CrudCategory[];
    onUpdate: (index: number, data: Partial<CrudCategory>) => Promise<void>;
    onDelete: (index: number) => Promise<void>;
    onAdd: (data: { category: string; devurl: string; produrl: string }) => Promise<void>;
}

export default function ManageCategories({
    isOpen,
    onClose,
    categories,
    onUpdate,
    onDelete,
    onAdd
}: ManageCategoriesProps) {
    const [newItem, setNewItem] = useState({
        category: '',
        devurl: '',
        produrl: ''
    });

    // Reset new item form when modal opens
    useEffect(() => {
        if (isOpen) {
            setNewItem({ category: '', devurl: '', produrl: '' });
        }
    }, [isOpen]);

    const handleAdd = async () => {
        if (!newItem.category.trim()) return;
        
        await onAdd({
            category: newItem.category.trim(),
            devurl: newItem.devurl.trim() || 'http://localhost:3200',
            produrl: newItem.produrl.trim() || 'http://localhost:3200'
        });
        
        setNewItem({ category: '', devurl: '', produrl: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-[800px] max-h-[85vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
                    <h3 className="font-bold text-white text-lg tracking-tight">Manage Categories</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
                    
                    {/* Add New Section */}
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4 flex flex-col gap-3">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                             <i className="fas fa-plus-circle"></i> Add New Category
                        </div>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                placeholder="Category Name" 
                                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                value={newItem.category}
                                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                             />
                             <input 
                                type="text" 
                                placeholder="Dev URL" 
                                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none"
                                value={newItem.devurl}
                                onChange={(e) => setNewItem({...newItem, devurl: e.target.value})}
                             />
                             <input 
                                type="text" 
                                placeholder="Prod URL" 
                                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none"
                                value={newItem.produrl}
                                onChange={(e) => setNewItem({...newItem, produrl: e.target.value})}
                             />
                             <button 
                                onClick={handleAdd}
                                disabled={!newItem.category.trim()}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-bold text-sm shadow-lg shadow-blue-900/20 transition-all flex-none"
                             >
                                Add
                             </button>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="flex flex-col gap-3">
                        {categories.map((cat, index) => (
                            <ManageCategoryItem 
                                key={index} 
                                category={cat} 
                                index={index} 
                                onUpdate={onUpdate} 
                                onDelete={onDelete} 
                            />
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center text-gray-500 italic py-8 border-2 border-dashed border-gray-800 rounded-lg">
                                No categories found. Add one above.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-gray-700"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ManageCategoryItemProps {
    category: CrudCategory;
    index: number;
    onUpdate: (index: number, data: Partial<CrudCategory>) => Promise<void>;
    onDelete: (index: number) => Promise<void>;
}

function ManageCategoryItem({ category, index, onUpdate, onDelete }: ManageCategoryItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        category: category.category,
        devurl: category.devurl,
        produrl: category.produrl
    });

    useEffect(() => {
        setEditData({
            category: category.category,
            devurl: category.devurl,
            produrl: category.produrl
        });
    }, [category]);

    const handleSave = async () => {
        if (!editData.category.trim()) return;
        await onUpdate(index, {
            category: editData.category.trim(),
            devurl: editData.devurl.trim(),
            produrl: editData.produrl.trim()
        });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm("The delete method can only be reversed by GIT, continue?")) {
            await onDelete(index);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-3 flex flex-col gap-3 animate-fade-in">
                 <div className="flex gap-2 items-center">
                     <span className="text-xs font-bold text-blue-400 uppercase w-16">Name</span>
                     <input 
                        type="text" 
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                        value={editData.category}
                        onChange={(e) => setEditData({...editData, category: e.target.value})}
                     />
                 </div>
                 <div className="flex gap-2 items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase w-16">Dev URL</span>
                     <input 
                        type="text" 
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none"
                        value={editData.devurl}
                        onChange={(e) => setEditData({...editData, devurl: e.target.value})}
                     />
                 </div>
                 <div className="flex gap-2 items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase w-16">Prod URL</span>
                     <input 
                        type="text" 
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none"
                        value={editData.produrl}
                        onChange={(e) => setEditData({...editData, produrl: e.target.value})}
                     />
                 </div>
                 <div className="flex justify-end gap-2 mt-1">
                     <button 
                        onClick={() => setIsEditing(false)}
                        className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded hover:bg-gray-700 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded text-xs font-bold transition-colors shadow-lg shadow-green-900/20"
                     >
                        Save Changes
                     </button>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center justify-between group hover:border-gray-600 transition-colors">
            <div className="flex flex-col gap-1 overflow-hidden">
                <div className="font-bold text-white text-base truncate pr-4">{category.category}</div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                        <span className="truncate max-w-[200px]" title={category.devurl}>{category.devurl || 'http://localhost:3200'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500/50"></span>
                        <span className="truncate max-w-[200px]" title={category.produrl}>{category.produrl || 'http://localhost:3200'}</span>
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" 
                    title="Edit"
                >
                    <i className="fas fa-pen"></i>
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" 
                    title="Delete"
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}
