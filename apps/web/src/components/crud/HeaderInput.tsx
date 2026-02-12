import useCrudState from "../../appstates/crud";
import CustomAceEditor from "../lib/CustomAceEditor";

export default function HeaderInput() {
    const header   = useCrudState.use.header();
    const setHeader = useCrudState.use.setHeader();

    return (
        <div className="h-[30%] flex flex-col overflow-hidden gap-2">
            <h2 className="text-md font-bold text-gray-200">
                Header
            </h2>
            <div className="flex-1 min-h-0">
                <CustomAceEditor
                    value={header}
                    onChange={setHeader}
                    transparent={true}
                />
            </div>
        </div>
    );
}