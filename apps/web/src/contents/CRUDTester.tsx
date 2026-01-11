//import Undercontsruct from "../components/Undercontsruct"
import { useState, useEffect } from "react";
import AccordionNav from "../components/crud/AccordionNav";
import CrudEditor from "../components/crud/CrudEditor";
import CrudInputEditor from "../components/crud/CrudInputEditor";
import CrudOutput from "../components/crud/CrudOutput";
import CrudSuggest from "../components/crud/CrudSuggest";
import ManageCategories from "../components/crud/ManageCategories";

import type { CrudItem, CrudCategory } from '../components/crud/types';

const INITIAL_CRUD_DATA: CrudCategory[] = [
  {
    "category": "Internal CRUD Test",
    "devurl": "http://localhost:3200",
    "produrl": "",
    "items": [
      {
        "label": "Ping the Tool Server",
        "route": "/pingme",
        "methods": "GET",
        "description": "Ping the tool server to check if it is running.",
        "sampleInput": "{}",
        "suggested": [],
        "expectedOutcome": "# You should see the word \"pong\" as a message \n\n{\n  \"message\": \"pong\"\n}",
        "availableFor": "public"
      },
      {
        "label": "Check Post",
        "route": "/pingpost",
        "methods": "POST",
        "description": "Send a POST request to check if it sending correctly",
        "sampleInput": "{\n   \"data\": \"test\",\n   \"message\": \"test\"\n}",
        "suggested": [
          {
            "name": "Customer Data",
            "urlparams": "",
            "content": "{\n    \"name\": \"Demo Customer\",\n    \"email\": \"demo@test.com\",\n    \"phone\": \"123456789\",\n    \"icon\": \"test icon\"\n}"
          }
        ],
        "expectedOutcome": "# Note \nYou should see the mirror of your inputs",
        "availableFor": "public"
      },
      {
        "label": "Check Stream",
        "route": "/pingstream",
        "methods": "STREAM",
        "description": "Send a stream request to check if it sending correctly",
        "sampleInput": "{ }",
        "suggested": [
          {
            "name": "I Wandered Lonely as a Cloud",
            "urlparams": "?poem=I%20Wandered%20Lonely%20as%20a%20Cloud",
            "content": "{}"
          },
          {
            "name": "The Sun Has Long Been Set",
            "urlparams": "?poem=The%20Sun%20Has%20Long%20Been%20Set",
            "content": "{}"
          }
        ],
        "expectedOutcome": "# Note \nYou should see the stream of words",
        "availableFor": "public"
      }
    ]
  }
];

interface CRUDTesterProps {
    isVisible: boolean
}

export default function CRUDTester(props: CRUDTesterProps) {
    const [crudData, setCrudData] = useState<CrudCategory[]>(INITIAL_CRUD_DATA);
    
    // Selection State
    const [selectedRoute, setSelectedRoute] = useState<{ catIndex: number, itemIndex: number } | null>(null);
    const [viewMode, setViewMode] = useState<'tester' | 'manage'>('tester');
    
    // Editor Components State
    const [editorState, setEditorState] = useState<{ isOpen: boolean, catIndex: number, itemIndex: number }>({
        isOpen: false,
        catIndex: -1,
        itemIndex: -1
    });

    // Validated Selected Item
    const selectedItem = selectedRoute && crudData[selectedRoute.catIndex]?.items[selectedRoute.itemIndex];
    const activeCategory = selectedRoute && crudData[selectedRoute.catIndex];

    // Presets & Active Inputs State
    const [isPresetsOpen, setIsPresetsOpen] = useState(false);
    const [activeBody, setActiveBody] = useState('');
    const [activeParams, setActiveParams] = useState('');

    // Reset inputs when selected item changes
    useEffect(() => {
        if (selectedItem) {
            setActiveBody(selectedItem.sampleInput || '{}');
            setActiveParams('');
            setIsPresetsOpen(false);
        }
    }, [selectedItem]);

    // --- Handlers for AccordionNav ---

    const handleSelectRoute = (categoryIndex: number, itemIndex: number) => {
        setSelectedRoute({ catIndex: categoryIndex, itemIndex });
        setViewMode('tester');
    };

    const handleManageCategories = () => {
        setViewMode('manage');
    };

    const handleAddRoute = (categoryIndex: number) => {
        setEditorState({ isOpen: true, catIndex: categoryIndex, itemIndex: -1 });
    };

    const handleEditRoute = (categoryIndex: number, itemIndex: number) => {
        setEditorState({ isOpen: true, catIndex: categoryIndex, itemIndex });
    };

    const handlePresetSelect = (suggestion: any) => {
        setActiveBody(suggestion.content);
        setActiveParams(suggestion.urlparams);
        setIsPresetsOpen(false);
    };

    // --- Handlers for CrudEditor (Route) ---

    const handleSaveRoute = async (data: CrudItem, catIndex: number, itemIndex: number, action: 'add' | 'update') => {
        const newData = [...crudData];
        if (action === 'add') {
            newData[catIndex].items.push(data);
             // Select the new item
             setSelectedRoute({ catIndex, itemIndex: newData[catIndex].items.length - 1 });
        } else {
            newData[catIndex].items[itemIndex] = data;
        }
        setCrudData(newData);
        setViewMode('tester'); // Ensure we are in tester mode to see changes
    };

    const handleDeleteRoute = async (catIndex: number, itemIndex: number) => {
        const newData = [...crudData];
        newData[catIndex].items.splice(itemIndex, 1);
        setCrudData(newData);
        
        // If we deleted the selected item, deselect it
        if (selectedRoute && selectedRoute.catIndex === catIndex && selectedRoute.itemIndex === itemIndex) {
            setSelectedRoute(null);
        }
    };

    // --- Handlers for ManageCategories ---

    const handleUpdateCategory = async (index: number, data: Partial<CrudCategory>) => {
        const newData = [...crudData];
        newData[index] = { ...newData[index], ...data };
        setCrudData(newData);
    };

    const handleDeleteCategory = async (index: number) => {
        const newData = [...crudData];
        newData.splice(index, 1);
        setCrudData(newData);
        
        // If selected route was in this category, deselect it
        if (selectedRoute && selectedRoute.catIndex === index) {
            setSelectedRoute(null);
        }
    };

    const handleAddCategory = async (data: { category: string; devurl: string; produrl: string }) => {
        const newCategory: CrudCategory = {
            ...data,
            items: []
        };
        setCrudData([...crudData, newCategory]);
    };

    return (
        <div className={`flex h-full w-full opacity-0 animate-fade-in ${props.isVisible ? 'opacity-100' : ''}`}>
            {/* Sidebar */}
            <div className="w-[340px] h-full flex-none  flex flex-col z-20">
                <div className="h-14 px-4 flex-none flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
                    <span className="text-xs font-bold uppercase text-blue-400 tracking-widest flex items-center gap-2">
                        <i className="fas fa-database"></i>
                        CRUD Explorer
                    </span>
                    <button className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                        <i className="fas fa-sync-alt text-xs"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar" id="crud-nav-container">
                    <AccordionNav 
                        categories={crudData}
                        selectedCategoryIndex={selectedRoute?.catIndex ?? null}
                        selectedItemIndex={selectedRoute?.itemIndex ?? null}
                        onSelect={handleSelectRoute}
                        onAddRoute={handleAddRoute}
                        onEditRoute={handleEditRoute}
                        onManageCategories={handleManageCategories}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div id="crud-main-content" className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Patterns */}
                

                {viewMode === 'manage' ? (
                     <ManageCategories 
                        isOpen={true} 
                        onClose={() => setViewMode('tester')}
                        categories={crudData}
                        onUpdate={handleUpdateCategory}
                        onDelete={handleDeleteCategory}
                        onAdd={handleAddCategory}
                     />
                ) : (
                    <>
                    {/* Tester View */}
                    {selectedItem && activeCategory ? (
                        <>
                             {/* Header Bar */}
                            <div className="h-16 flex items-center px-6 gap-6 z-20">
                                <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
                                    <button 
                                        id="crud-btn-dev" 
                                        className="px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                        title={activeCategory.devurl}
                                    >
                                        Dev
                                    </button>
                                    <button 
                                        id="crud-btn-prod" 
                                        className="px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all text-gray-500 hover:text-gray-300 hover:bg-white/5" 
                                        title={activeCategory.produrl}
                                    >
                                        Prod
                                    </button>
                                </div>

                                <div className="h-8 w-px bg-white/10"></div>

                                <div className="flex items-center gap-4 flex-1">
                                    <span id="crud-info-avail" className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-gray-800 text-gray-400 border border-white/5">
                                        {selectedItem.availableFor}
                                    </span>
                                    <div className="flex items-baseline gap-2 overflow-hidden">
                                        <span className="text-gray-500 font-mono text-sm">LOCALHOST://</span>
                                        <span id="crud-info-route" className="font-bold text-gray-200 text-lg sm:text-lg truncate">
                                            {selectedItem.route}
                                        </span>
                                    </div>
                                    <span id="crud-info-method" className="ml-auto font-mono text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
                                        {selectedItem.methods}
                                    </span>
                                </div>
                            </div>

                            {/* Info Block & Controls */}
                             <div className="py-4 px-6 flex flex-col gap-5 relative z-20">
                                {/* Row 1: Label | Description */}
                                <div className="flex items-center gap-4">
                                    <h1 id="crud-info-label" className="text-xl font-bold text-white tracking-tight flex-none">{selectedItem.label}</h1>
                                    <div className="h-5 w-px bg-white/10"></div>
                                    <p id="crud-info-desc" className="text-sm text-gray-400 truncate flex-1 font-light">
                                        {selectedItem.description || "No description provided."}
                                    </p>
                                </div>

                                {/* Row 2: Controls */}
                                <div className="flex items-center gap-4">
                                    <button 
                                        className="group relative px-6 py-2 rounded-xl font-bold text-xs tracking-wide text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20 flex-none h-10 flex items-center gap-2"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="relative z-10">SEND REQUEST</span>
                                        <i className="fas fa-paper-plane relative z-10"></i>
                                    </button>

                                    <div className="relative flex-none" id="crud-presets-container">
                                        <button 
                                            id="crud-presets-btn" 
                                            className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium px-4 h-10 rounded-xl border border-white/10 transition-all w-48 group"
                                            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
                                            disabled={!selectedItem.suggested || selectedItem.suggested.length === 0}
                                        >
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-list-ul text-[10px] text-gray-500 group-hover:text-blue-400 transition-colors"></i>
                                                <span id="crud-presets-label">Presets</span>
                                            </div>
                                            <i className={`fas fa-chevron-down text-[10px] opacity-50 transition-transform ${isPresetsOpen ? 'rotate-180' : ''}`}></i>
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {isPresetsOpen && (
                                            <>
                                                <div className="fixed inset-0 z-[90]" onClick={() => setIsPresetsOpen(false)}></div>
                                                <div id="crud-presets-menu" className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0A] border border-gray-700 rounded-xl shadow-2xl z-[100] overflow-hidden flex flex-col py-2 animate-fade-in-down">
                                                    {selectedItem.suggested.map((suggestion, idx) => (
                                                        <button 
                                                            key={idx}
                                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors group border-l-2 border-transparent hover:border-blue-500 mx-1 rounded-r-lg"
                                                            onClick={() => handlePresetSelect(suggestion)}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
                                                                 <i className="fas fa-file-code text-gray-500 group-hover:text-blue-400 text-xs transition-colors"></i>
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="font-medium text-gray-200 text-xs truncate group-hover:text-white transition-colors">{suggestion.name}</span>
                                                                {suggestion.urlparams && <span className="text-[10px] text-gray-600 font-mono truncate group-hover:text-gray-500">{suggestion.urlparams}</span>}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex-1 flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 h-10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all group hover:border-white/10">
                                        <i className="fas fa-code-branch text-gray-600 text-xs group-focus-within:text-blue-500 transition-colors"></i>
                                        <input 
                                            type="text" 
                                            id="crud-param-input" 
                                            placeholder="Query Params (e.g. ?id=123)"
                                            className="bg-transparent border-none text-xs text-gray-300 w-full focus:outline-none placeholder-gray-700 font-mono h-full"
                                            value={activeParams}
                                            onChange={(e) => setActiveParams(e.target.value)} 
                                        />
                                    </div>

                                    <div className="flex-none bg-black/40 border border-white/5 rounded-xl px-4 h-10 flex items-center gap-3">
                                        <span className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">Latency</span>
                                        <span id="crud-timer" className="text-green-400 font-mono font-bold text-sm">0 ms</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3 Column Grid for Content */}
                             <div id="crud-grid-layout" className="flex-1 grid grid-cols-3 gap-0 min-h-0 transition-all duration-300">
                                {/* Col 1: Inputs */}
                                <div className="grid grid-rows-12 grid-cols-1 h-full p-0 gap-0 min-h-0 ">
                                    <div id="input-header-container" className="row-span-4 min-h-0 ">
                                        <div className="h-full p-3">
                                             <CrudInputEditor title="Request Headers" initialValue="{}" />
                                        </div>
                                    </div>
                                    <div id="input-body-container" className="row-span-8 min-h-0">
                                        <div className="h-full p-3">
                                            <CrudInputEditor 
                                                title="Request Body" 
                                                initialValue={activeBody} 
                                                onChange={(val) => setActiveBody(val)} // Optional: if we want to sync back
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Col 2: Output */}
                                <div className="flex flex-col h-full min-h-0 ">
                                    <div id="output-container" className="h-full p-3">
                                        <CrudOutput output={{
                                            status: 200,
                                            statusText: "OK",
                                            data: selectedItem.expectedOutcome,
                                            headers: {"content-type": "application/json"}
                                        }} />
                                    </div>
                                </div>
        
                                {/* Col 3: Suggested */}
                                <div className="flex flex-col h-full min-h-0">
                                    <div id="suggest-container-wrapper" className="h-full p-3">
                                        <CrudSuggest value={selectedItem.suggested} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                         <div id="crud-empty-state" className="relative z-10 flex-1 flex items-center justify-center text-gray-600 flex-col gap-6 opacity-60 select-none animate-pulse">
                            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center">
                                 <i className="fas fa-rocket text-6xl text-gray-700"></i>
                            </div>
                            <p className="text-xl font-medium tracking-tight">Select an endpoint to start testing</p>
                        </div>
                    )}
                    </>
                )}
            </div>

            {/* CrudEditor Modal */}
            <CrudEditor 
                isOpen={editorState.isOpen} 
                onClose={() => setEditorState(prev => ({ ...prev, isOpen: false }))} 
                categoryIndex={editorState.catIndex} 
                itemIndex={editorState.itemIndex} 
                initialData={
                    editorState.itemIndex !== -1 
                        ? crudData[editorState.catIndex]?.items[editorState.itemIndex] 
                        : undefined
                }
                onSave={handleSaveRoute} 
                onDelete={handleDeleteRoute} 
            />
        </div>
    )
}