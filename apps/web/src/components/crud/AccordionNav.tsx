import { useState } from 'react';
import type { CrudCategory } from './types';

interface AccordionNavProps {
    categories: CrudCategory[];
    selectedCategoryIndex: number | null;
    selectedItemIndex: number | null;
    onSelect: (categoryIndex: number, itemIndex: number) => void;
    onAddRoute: (categoryIndex: number) => void;
    onEditRoute: (categoryIndex: number, itemIndex: number) => void;
    onManageCategories: () => void;
}

export default function AccordionNav({
    categories,
    selectedCategoryIndex,
    selectedItemIndex,
    onSelect,
    onAddRoute,
    onEditRoute,
    onManageCategories
}: AccordionNavProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([0]));

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-green-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-violet-400';
      case 'DELETE': return 'text-red-400';
      case 'PATCH': return 'text-purple-400';
      case 'STREAM': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {categories.map((category, catIndex) => (
        <div key={catIndex} className="accordion-category flex flex-col">
          {/* Header */}
          <div
            className="accordion-header flex items-center gap-2 px-3 py-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-all select-none group border border-transparent hover:border-white/5"
            onClick={() => toggleCategory(catIndex)}
          >
            <i
              className={`fas fa-chevron-right text-[10px] text-gray-600 transition-transform duration-300 ${
                expandedCategories.has(catIndex) ? 'rotate-90 text-blue-500' : ''
              }`}
            ></i>
            <i
              className={`fas fa-folder text-sm transition-colors duration-300 ${
                expandedCategories.has(catIndex) ? 'text-blue-400 opacity-100' : 'text-gray-600 group-hover:text-gray-400'
              }`}
            ></i>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide group-hover:text-white transition-colors category-title">
              {category.category}
            </span>
            <span className="ml-auto text-[10px] font-mono text-gray-700 bg-gray-900 px-1.5 rounded">{category.items.length}</span>
          </div>

          {/* Content */}
          <div className={`accordion-content flex flex-col gap-1 pl-3 mt-1 relative overflow-hidden transition-all duration-300 ${expandedCategories.has(catIndex) ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'}`}>
             <div className="absolute left-[13px] top-0 bottom-0 w-px bg-gradient-to-b from-gray-800 to-transparent"></div>
             
             <div className="pl-4 flex flex-col gap-1">
                {category.items.map((item, itemIndex) => {
                const isActive = selectedCategoryIndex === catIndex && selectedItemIndex === itemIndex;
                return (
                    <div
                    key={itemIndex}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg group cursor-pointer transition-all duration-200 nav-item-row border ${
                        isActive
                        ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30'
                        : 'border-transparent hover:bg-white/5 hover:border-white/5'
                    }`}
                    onClick={() => onSelect(catIndex, itemIndex)}
                    >
                    <span className={`font-black font-mono w-10 flex-none text-[10px] opacity-90 ${getMethodColor(item.methods)} bg-gray-900/50 px-1 rounded text-center`}>
                        {item.methods.toUpperCase().slice(0, 4)}
                    </span>
                    <span className={`flex-1 truncate text-[13px] ${isActive ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'} transition-colors`} title={item.label}>
                        {item.label}
                    </span>
                    <button
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-blue-600 hover:text-white text-gray-500 rounded transition-all transform hover:scale-110"
                        title="Edit"
                        onClick={(e) => {
                        e.stopPropagation();
                        onEditRoute(catIndex, itemIndex);
                        }}
                    >
                        <i className="fas fa-pen text-[10px]"></i>
                    </button>
                    </div>
                );
                })}

                {/* Add Route Button */}
                <button
                    className="mt-1 flex items-center justify-start gap-2 px-3 py-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/5 rounded-lg transition-all group border border-transparent hover:border-blue-500/20"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddRoute(catIndex);
                    }}
                >
                    <div className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                         <i className="fas fa-plus text-[10px]"></i>
                    </div>
                    <span className="text-[12px] font-medium">Add Route</span>
                </button>
            </div>
          </div>
        </div>
      ))}

      {/* Manage Categories Button */}
      <div className="mt-4 px-2 mb-8">
        <button
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-blue-600/20 hover:to-purple-600/20 border border-gray-700 hover:border-blue-500/30 text-gray-400 hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
            onClick={onManageCategories}
        >
            <i className="fas fa-cog group-hover:rotate-90 transition-transform duration-500"></i>
            Manage Categories
        </button>
      </div>
    </div>
  );
}
