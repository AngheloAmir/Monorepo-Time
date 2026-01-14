import useCrudState from "../../_context/crud"


export default function MainContentInput() {
    const params    = useCrudState.use.params();
    const setParams = useCrudState.use.setParams();

    return (
        <div className="flex flex-col gap-5 px-4">
            <div className="flex items-center gap-4">
                <button
                    className="group relative px-6 py-2 rounded-xl font-bold text-xs tracking-wide text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20 flex-none h-10 flex items-center gap-2"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">
                        SEND REQUEST
                    </span>
                    <i className="fas fa-paper-plane relative z-10"></i>
                </button>

                <div className="flex-none bg-black/40 border border-white/5 rounded-xl px-4 h-10 flex items-center gap-3">
                    <span className="text-green-400 font-mono font-bold text-sm">
                        0 ms
                    </span>
                </div>

                <div className="group rounded-lg transition-all duration-300 w-full mr-4 lg:mr-12">
                <div className={`p-[1px] rounded-lg bg-gradient-to-r 
                    from-gray-700/40 to-gray-800/40 
                    group-focus-within:from-blue-500/40 
                    group-focus-within:to-purple-600/40
                    transition-colors duration-300`}>
                    <div className="bg-gray/[0.1] rounded flex items-center overflow-hidden">
                        <div className="pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-code-branch text-gray-500 group-focus-within:text-blue-400 transition-colors text-sm"></i>
                        </div>
                        <input
                            type="text"
                            className="pl-3 pr-4 py-2.5 text-sm w-full text-white placeholder-gray-600 focus:outline-none"
                            placeholder="Query Params (e.g. ?id=123)"
                            value={params}
                            onChange={(e) => {
                                setParams( e.target.value )
                            }}
                        />
                    </div>
                </div>
                </div>


            </div>
        </div>
    )
}



//    <button
//                         id="crud-presets-btn"
//                         className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium px-4 h-10 rounded-xl border border-white/10 transition-all w-48 group"
//                     //onClick={() => setIsPresetsOpen(!isPresetsOpen)}
//                     //disabled={!selectedItem.suggested || selectedItem.suggested.length === 0}
//                     >
//                         <div className="flex items-center gap-2">
//                             <i className="fas fa-list-ul text-[10px] text-gray-500 group-hover:text-blue-400 transition-colors"></i>
//                             <span id="crud-presets-label">Presets</span>
//                         </div>
//                         <i className={`fas fa-chevron-down text-[10px] opacity-50 transition-transform `}></i>
//                     </button>

// <div id="crud-presets-menu" className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0A] border border-gray-700 rounded-xl shadow-2xl z-[100] overflow-hidden flex flex-col py-2 animate-fade-in-down">
//     {/* {selectedItem.suggested.map((suggestion, idx) => (
//         <button
//             key={idx}
//             className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors group border-l-2 border-transparent hover:border-blue-500 mx-1 rounded-r-lg"
//             onClick={() => handlePresetSelect(suggestion)}
//         >
//             <div className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:border-blue-500/30 transition-colors">
//                 <i className="fas fa-file-code text-gray-500 group-hover:text-blue-400 text-xs transition-colors"></i>
//             </div>
//             <div className="flex flex-col min-w-0">
//                 <span className="font-medium text-gray-200 text-xs truncate group-hover:text-white transition-colors">{suggestion.name}</span>
//                 {suggestion.urlparams && <span className="text-[10px] text-gray-600 font-mono truncate group-hover:text-gray-500">{suggestion.urlparams}</span>}
//             </div>
//         </button>
//     ))} */}
// </div>