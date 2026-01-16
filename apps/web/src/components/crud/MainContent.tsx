import BodyInput from "./BodyInput";
import CrudExpectedOutput from "./CrudExpectedOutput";
import CrudOutput from "./CrudOutput";
import HeaderInput from "./HeaderInput";
import MainContentHeader from "./MainContentHeader";
import MainContentInput from "./MainContentInput";

import useCrudState from "../../appstates/crud";

export default function MainContent() {
    const currentCategoryIndex = useCrudState.use.currentCategoryIndex();
    const currentCrudIndex = useCrudState.use.currentCrudIndex();

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

            <div className="grid grid-cols-3 flex-1 pt-4 pb-6 gap-4">
                <div className="col-span-1 flex flex-col gap-4">
                    <HeaderInput />
                    <BodyInput />
                </div>

                <div className="col-span-1 overflow-hidden h-[calc(100%-80px)]">
                    <CrudOutput />
                </div>
                <div className="col-span-1 overflow-hidden h-full">
                    <CrudExpectedOutput />
                </div>
            </div>
        </div>
    )
}

