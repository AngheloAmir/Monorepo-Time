import { useEffect } from "react";
import useCrudState from "../../appstates/crud";
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

    if (noData && props.isVisible)
        return <Intro />

    return (
        <div className={`flex h-full w-full ${props.isVisible ? 'block' : 'hidden'}`}>
            <Sidebar />
            <div id="crud-main-content" className="px-2 flex-1 flex flex-col relative overflow-hidden">
                <MainContent />
            </div>
        </div>
    )
}
