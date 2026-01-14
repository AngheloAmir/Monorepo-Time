import MainContent from "../components/crud/MainContent";
import Sidebar from "../components/crud/Sidebar";

interface CRUDTesterProps {
    isVisible: boolean
}

export default function CRUDTester(props: CRUDTesterProps) {

    return (
        <div className={`flex h-full w-full pb-8 px-4 ${props.isVisible ? 'block' : 'hidden'}`}>
            <Sidebar />
            <div id="crud-main-content" className="flex-1 flex flex-col relative overflow-hidden">
                <MainContent />
            </div>
        </div>
    )
}