import AccordionNav from "./AccordionNav";

export default function Sidebar() {
    return (
        <div className="w-[340px] h-full flex-none  flex flex-col z-20">
            <div className="h-14 px-4 flex-none flex items-center justify-between ">
                <span className="text-xs font-bold uppercase text-blue-400 tracking-widest flex items-center gap-2">
                    <i className="fa-solid fa-circle-nodes"></i>
                    Simple CRUD Test
                </span>
                <button className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                    <i className="fas fa-sync-alt text-xs"></i>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
                <AccordionNav />
            </div>
        </div>
    )
}