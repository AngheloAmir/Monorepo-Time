import { useEffect } from "react";
import useCrudState from "../../_context/crud";
import MainContent from "../crud/MainContent";
import Sidebar from "../crud/Sidebar";
import Intro from "../crud/Intro";

interface CRUDTesterProps {
    isVisible: boolean
}

export default function CRUDTester(props: CRUDTesterProps) {
    const noData = useCrudState.use.noData();
    const loadCrudData = useCrudState.use.loadCrudData();

    useEffect(() => {
        if (props.isVisible) {
            loadCrudData();
        }
    }, [props.isVisible]);

    if (noData)
        return <Intro />

    return (
        <div className={`flex h-full w-full pb-8 px-4 ${props.isVisible ? 'block' : 'hidden'}`}>
            <Sidebar />
            <div id="crud-main-content" className="flex-1 flex flex-col relative overflow-hidden">
                <MainContent />
            </div>
        </div>
    )
}
