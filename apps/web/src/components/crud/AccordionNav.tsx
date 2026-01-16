import { useState } from "react";
import useCrudState from "../../appstates/crud";
import CrudEdit from "./CrudEdit";
import CategoryEdit from "./CategoryEdit";

export default function AccordionNav() {
    const crudData = useCrudState.use.crudData();
    const currentCategoryIndex = useCrudState.use.currentCategoryIndex();
    const currentCrudIndex = useCrudState.use.currentCrudIndex();
    
    const setCurrentCategoryIndex = useCrudState.use.setCurrentCategoryIndex();
    const setCurrentCrudIndex = useCrudState.use.setCurrentCrudIndex();
    
    const setMethod = useCrudState.use.setMethod();
    const setParams = useCrudState.use.setParams();
    const setBody = useCrudState.use.setBody();
    const setExpectedOutput = useCrudState.use.setExpectedOutput();
    const setOutput = useCrudState.use.setOutput();

    const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({ 0: false });
    const [editModal, setEditModal]           = useState({ isOpen: false, categoryIndex: 0, itemIndex: 0 });
    const [categoryEditModal, setCategoryEditModal] = useState({ isOpen: false, categoryIndex: -1 });

    const toggleCategory = (index: number) => {
        setOpenCategories(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleItemClick = (catIndex: number, itemIndex: number, item: any) => {
        setCurrentCategoryIndex(catIndex);
        setCurrentCrudIndex(itemIndex);
        
        // Update context with item data
        setMethod(item.methods);
        setParams(""); // Reset params or parse if stored
        // setHeader? Usually stays default but could be custom
        setBody(item.sampleInput || "");
        setExpectedOutput(item.expectedOutcome || "");
        setOutput(""); // Reset output
    };

    return (
        <div className="w-full flex flex-col gap-3 pb-10">
            {crudData.map((category, catIndex) => (
                <div key={catIndex} className="flex flex-col">
                    <button 
                        onClick={() => toggleCategory(catIndex)}
                        className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors group mb-1"
                    >
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                            {category.category}
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategoryEditModal({ isOpen: true, categoryIndex: catIndex });
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all text-gray-500 hover:text-white"
                            >
                                <i className="fas fa-pen text-[10px]"></i>
                            </div>
                            <i className={`fas fa-chevron-down text-[10px] text-gray-600 transition-transform duration-200 ${openCategories[catIndex] ? 'rotate-180' : ''}`}></i>
                        </div>
                    </button>

                    {openCategories[catIndex] && (
                        <div className="flex flex-col gap-1 pl-2">
                            {category.items.map((item, itemIndex) => {
                                const isActive = catIndex === currentCategoryIndex && itemIndex === currentCrudIndex;
                                return (
                                    <div 
                                        key={itemIndex}
                                        className={`group relative flex items-center justify-between px-2 rounded-lg cursor-pointer transition-all border border-transparent
                                            ${isActive 
                                                ? 'bg-blue-500/10 border-blue-500/20' 
                                                : 'hover:bg-white/5 hover:border-white/5'
                                            }`}
                                        onClick={() => handleItemClick(catIndex, itemIndex, item)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                                item.methods === 'GET' ? 'bg-green-500/20 text-green-400' :
                                                item.methods === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                                item.methods === 'PUT' ? 'bg-orange-500/20 text-orange-400' :
                                                item.methods === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {item.methods}
                                            </span>
                                            <span className={`text-sm font-medium truncate transition-colors ${isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditModal({ isOpen: true, categoryIndex: catIndex, itemIndex });
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                                            title="Edit Item"
                                        >
                                            <i className="fas fa-pen text-xs"></i>
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                onClick={() => setEditModal({ isOpen: true, categoryIndex: catIndex, itemIndex: -1 })}
                                className="w-full py-1 mt-1 text-xs text-gray-500 hover:text-white transition-all flex gap-2"
                            >
                                <i className="fas fa-plus"></i>
                                Add Route
                            </button>
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={() => setCategoryEditModal({ isOpen: true, categoryIndex: -1 })}
                className="w-full py-2 hover:border-white/20 text-xs font-bold text-gray-500 hover:text-white transition-all flex gap-2"
            >
                <i className="fas fa-folder-plus group-hover:scale-110 transition-transform"></i>
                Add Category
            </button>

            <CrudEdit 
                isOpen={editModal.isOpen} 
                onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
                categoryIndex={editModal.categoryIndex}
                itemIndex={editModal.itemIndex}
            />
            
            <CategoryEdit
                isOpen={categoryEditModal.isOpen}
                onClose={() => setCategoryEditModal(prev => ({ ...prev, isOpen: false }))}
                categoryIndex={categoryEditModal.categoryIndex}
            />
        </div>
    )
}
