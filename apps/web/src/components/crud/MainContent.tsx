import BodyInput from "./BodyInput";
import CrudExpectedOutput from "./CrudExpectedOutput";
import CrudOutput from "./CrudOutput";
import HeaderInput from "./HeaderInput";
import MainContentHeader from "./MainContentHeader";
import MainContentInput from "./MainContentInput";

import useCrudState from "../../appstates/crud";
import { useState } from "react";

export default function MainContent() {
    const currentCategoryIndex = useCrudState.use.currentCategoryIndex();
    const currentCrudIndex = useCrudState.use.currentCrudIndex();
    const [isMinimized, setIsMinimized] = useState(false);

    if (currentCategoryIndex === -1 || currentCrudIndex === -1) {
        return (
            <div id="crud-empty-state" className="relative z-10 flex-1 flex items-center justify-center text-gray-600 flex-col gap-6 opacity-60 select-none animate-pulse">
                <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center">
                    <i className="fas fa-rocket text-6xl text-gray-700"></i>
                </div>
                <p className="text-xl font-medium tracking-tight">Select an endpoint to start testing</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col relative overflow-hidden">
            <MainContentHeader />
            <MainContentInput />

            {isMinimized ? (
                <div className="flex flex-row flex-1 pt-4 pb-6 gap-4 h-full overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="w-[32%] flex flex-col gap-4">
                        <HeaderInput />
                        <BodyInput />
                    </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <CrudOutput />
                </div>
                <div className="w-[32px] flex flex-col">
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="w-6 h-6 rounded-md bg-gray-700 text-gray-300 flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                        <i className="fa fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            ) : (
                <div className="grid grid-cols-3 flex-1 pt-4 pb-6 gap-4 h-full overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="col-span-1 flex flex-col gap-4">
                        <HeaderInput />
                        <BodyInput />
                    </div>

                <div className="col-span-1 overflow-hidden">
                    <CrudOutput />
                </div>
                <div className={`col-span-1 overflow-hidden transition-all duration-300 ease-in-out`}>
                    <CrudExpectedOutput 
                        onMinimize={() => setIsMinimized( true )}
                    />
                </div>
            </div>
            )}
        </div>
    )
}

