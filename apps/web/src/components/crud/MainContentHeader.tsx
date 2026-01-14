import useCrudState from "../../_context/crud";

export default function MainContentHeader() {
    const useDevURL = useCrudState.use.useDevURL();
    const setUseDevURL = useCrudState.use.setUseDevURL();
    const devURL = useCrudState.use.devURL();
    const prodURL = useCrudState.use.prodURL();
    const params = useCrudState.use.params();
    const method = useCrudState.use.method();

    const crudData             = useCrudState.use.crudData();
    const currentCategoryIndex = useCrudState.use.currentCategoryIndex();
    const currentCrudIndex     = useCrudState.use.currentCrudIndex();

    return (
        <header className="h-16 flex items-center px-4 gap-6 mb-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
                <button
                    onClick={() => setUseDevURL(true)}
                    className={`${useDevURL ? "bg-gradient-to-r from-blue-600 to-blue-500" : ""} px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all text-white`}
                    title={devURL}
                >
                    Dev
                </button>
                <button
                    onClick={() => setUseDevURL(false)}
                    className={`${useDevURL ? "" : "bg-gradient-to-r from-blue-600 to-blue-500"} px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all text-white`}
                    title={prodURL}
                >
                    Prod
                </button>
            </div>

            <div className="h-12 w-px bg-white/10"></div>

            <div className=" flex flex-col  gap-1">
                <div className="flex flex-start justify-start gap-2 overflow-hidden">
                    <span className="font-mono text-md font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 rounded">
                        {method}
                    </span>
                    <span className="text-gray-500 font-mono text-md">
                        { `${useDevURL ? devURL : prodURL}${crudData[currentCategoryIndex].items[currentCrudIndex].route}${params ? `?${params}` : ""}` }
                    </span>
                </div>

                <div className="flex items-baseline gap-2 overflow-hidden">
                    <span className=" text-xs font-bold text-blue-400 ">
                        {crudData[currentCategoryIndex].items[currentCrudIndex].label}
                    </span>
                   
                     <span className="text-gray-500 text-sm">
                        {crudData[currentCategoryIndex].items[currentCrudIndex].description}
                     </span>
                </div>
            </div>

        </header>
    )
}