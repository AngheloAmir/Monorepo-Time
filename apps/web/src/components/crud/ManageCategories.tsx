import { useEffect, useState } from 'react';
import useCrudState from '../../_context/crud';
import type { CrudCategory } from './types';

export default function ManageCategories() {
    // Store Selectors
    // Store Selectors
    const categories = useCrudState.use.crudData();
    const onAdd = useCrudState.use.handleAddCategory();
    const setViewMode = useCrudState.use.setViewMode();

    const onClose = () => setViewMode('tester');
    const isOpen = true; // Always true when rendered in this context

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
        
        // Wrapper to match previous Promise signature if needed, but actions are void. 
        // User used async/await in handlers, but setCrudData is sync. 
        // We can just call the action.
        onAdd({
            category: newItem.category.trim(),
            devurl: newItem.devurl.trim() || 'http://localhost:3200',
            produrl: newItem.produrl.trim() || 'http://localhost:3200'
        });
        
        setNewItem({ category: '', devurl: '', produrl: '' });
    };

    return (
        <div className="absolute inset-0 z-[50] flex items-center justify-center animate-fade-in">
             {/* Backdrop */}
             <div className="absolute inset-0 bg-[#0A0A0A] bg-opacity-90 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-[#0F0F0F] border border-gray-800 rounded-2xl shadow-2xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden z-[60]">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-[#0A0A0A]">
                    <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
                             <i className="fas fa-folder-open text-gray-400"></i>
                         </div>
                        <div>
                             <h3 className="font-bold text-white text-xl tracking-tight">Manage Categories</h3>
                             <p className="text-gray-500 text-xs">Organize your API routes into folders</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col gap-8 bg-[#0F0F0F]">
                    
                    {/* Add New Section */}
                    <div className="bg-blue-900/5 border border-blue-500/10 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-blue-500/20 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 relative z-10">
                             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                             Add New Category
                        </div>
                        <div className="flex gap-4 relative z-10">
                             <div className="flex-1 flex flex-col gap-2">
                                 <label className="text-[10px] font-bold text-gray-600 uppercase">Category Name</label>
                                 <input 
                                    type="text" 
                                    placeholder="e.g. User Management" 
                                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all shadow-sm"
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                 />
                             </div>
                             <div className="flex-1 flex flex-col gap-2">
                                 <label className="text-[10px] font-bold text-gray-600 uppercase">Dev URL</label>
                                 <input 
                                    type="text" 
                                    placeholder="http://localhost:3200" 
                                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none transition-all shadow-sm"
                                    value={newItem.devurl}
                                    onChange={(e) => setNewItem({...newItem, devurl: e.target.value})}
                                 />
                             </div>
                             <div className="flex-1 flex flex-col gap-2">
                                 <label className="text-[10px] font-bold text-gray-600 uppercase">Prod URL</label>
                                 <input 
                                    type="text" 
                                    placeholder="https://api.myapp.com" 
                                    className="w-full bg-[#0A0A0A] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none transition-all shadow-sm"
                                    value={newItem.produrl}
                                    onChange={(e) => setNewItem({...newItem, produrl: e.target.value})}
                                 />
                             </div>
                             <div className="flex flex-col gap-2 justify-end">
                                 <button 
                                    onClick={handleAdd}
                                    disabled={!newItem.category.trim()}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex-none flex items-center gap-2"
                                 >
                                    <i className="fas fa-plus"></i> Add
                                 </button>
                             </div>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="flex flex-col gap-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Active Categories</div>
                        {categories.map((cat, index) => (
                            <ManageCategoryItem 
                                key={index} 
                                category={cat} 
                                index={index} 
                            />
                        ))}
                        {categories.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2 border-2 border-dashed border-gray-800 rounded-2xl">
                                <i className="fas fa-folder-open text-3xl opacity-50"></i>
                                <span className="text-sm font-medium">No categories found. Add one above.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-800 bg-[#0A0A0A] flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
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
}

function ManageCategoryItem({ category, index }: ManageCategoryItemProps) {
    const onUpdate = useCrudState.use.handleUpdateCategory();
    const onDelete = useCrudState.use.handleDeleteCategory();

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
        onUpdate(index, {
            category: editData.category.trim(),
            devurl: editData.devurl.trim(),
            produrl: editData.produrl.trim()
        });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm("The delete method can only be reversed by GIT, continue?")) {
            onDelete(index);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-[#111] border border-blue-500/30 rounded-2xl p-4 flex flex-col gap-4 animate-fade-in shadow-lg shadow-blue-900/10">
                 <div className="grid grid-cols-12 gap-4">
                     <div className="col-span-4 flex flex-col gap-1.5">
                         <label className="text-[10px] font-bold text-blue-400 uppercase">Name</label>
                         <input 
                            type="text" 
                            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            value={editData.category}
                            onChange={(e) => setEditData({...editData, category: e.target.value})}
                         />
                     </div>
                     <div className="col-span-4 flex flex-col gap-1.5">
                         <label className="text-[10px] font-bold text-gray-500 uppercase">Dev URL</label>
                         <input 
                            type="text" 
                            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none"
                            value={editData.devurl}
                            onChange={(e) => setEditData({...editData, devurl: e.target.value})}
                         />
                     </div>
                     <div className="col-span-4 flex flex-col gap-1.5">
                         <label className="text-[10px] font-bold text-gray-500 uppercase">Prod URL</label>
                         <input 
                            type="text" 
                            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 outline-none"
                            value={editData.produrl}
                            onChange={(e) => setEditData({...editData, produrl: e.target.value})}
                         />
                     </div>
                 </div>
                 <div className="flex justify-end gap-3 mt-1">
                     <button 
                        onClick={() => setIsEditing(false)}
                        className="text-xs font-bold text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-green-900/20"
                     >
                        Save Changes
                     </button>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-5 flex items-center justify-between group hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/50">
            <div className="flex flex-col gap-2 overflow-hidden">
                <div className="font-bold text-white text-lg truncate pr-4 group-hover:text-blue-400 transition-colors">{category.category}</div>
                <div className="flex items-center gap-6 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-2 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span className="truncate max-w-[250px]" title={category.devurl}>{category.devurl || 'http://localhost:3200'}</span>
                    </span>
                    <span className="flex items-center gap-2 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        <span className="truncate max-w-[250px]" title={category.produrl}>{category.produrl || 'http://localhost:3200'}</span>
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-3 text-gray-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all" 
                    title="Edit"
                >
                    <i className="fas fa-pen"></i>
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-3 text-gray-400 hover:text-white hover:bg-red-600 rounded-xl transition-all" 
                    title="Delete"
                >
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}
