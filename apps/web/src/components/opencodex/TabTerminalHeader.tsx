// import Button3Mini from "../ui/Button3Mini";
// import type { TerminalInstance } from "./TerminalContainer";

// interface TabTerminalHeaderProps {
//     tabs: TerminalInstance[];
//     activeTabId: string;
//     setActiveTabId: (id: string) => void;
//     closeTab: (id: string, e: React.MouseEvent) => void;
//     addTab: () => void;
// }

// export default function TabTerminalHeader({ tabs, activeTabId, setActiveTabId, closeTab, addTab }: TabTerminalHeaderProps) {
//     return (
//         <div className="flex items-center">
//             {tabs.map(tab => (
//                 <div
//                     key={tab.id}
//                     onClick={() => setActiveTabId(tab.id)}
//                     className={`
//                         group relative flex items-center justify-between rounded-t-md w-36 px-2 py-0.3
//                         cursor-pointer transition-all duration-300 select-none
//                         border-r border-white/5
//                         ${activeTabId === tab.id
//                             ? 'bg-gradient-to-br from-blue-600/40 to-blue-400/40 text-white'
//                             : 'bg-[#0b0b0b] text-gray-500 hover:bg-[#121212] hover:text-gray-300'
//                         }
//             `}
//                 >
//                     <span className="truncate text-sm flex-1">{tab.title}</span>
//                     {tabs.length > 1 ? (
//                         <button
//                             onClick={(e) => closeTab(tab.id, e)}
//                             className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-0.5 rounded"
//                         >
//                             <i className="fa-solid fa-times text-xs"></i>
//                         </button>
//                     ) : (
//                         <div className="opacity-0 p-0.5">
//                             <i className="fa-solid fa-times text-xs"></i>
//                         </div>
//                     )}
//                 </div>
//             ))}
//             <Button3Mini
//                 icon="fa-solid fa-plus"
//                 onClick={addTab}
//                 title="New Terminal"
//                 className="mx-2 px-2 opacity-50 hover:opacity-100"
//             />
//         </div>
//     );
// }