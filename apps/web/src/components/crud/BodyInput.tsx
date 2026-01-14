import CustomAceEditor from "./CustomAceEditor";
import useCrudState from "../../_context/crud";

export default function BodyInput() {
    const body    = useCrudState.use.body();
    const setBody = useCrudState.use.setBody();

    return (
        <div className="flex-1 flex flex-col min-h-0 gap-2">
            <h2 className="text-md font-bold text-gray-200">
                Request Body
            </h2>
            <div className="flex-1 min-h-0">
                <CustomAceEditor transparent={true} value={body} onChange={setBody} />
            </div>
        </div>
    );
}