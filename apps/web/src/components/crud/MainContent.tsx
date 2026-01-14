import MainContentHeader from "./MainContentHeader";
import MainContentInput from "./MainContentInput";


export default function MainContent() {
    
    return (
        <div className="flex-1 flex flex-col relative overflow-hidden">
            <MainContentHeader />
            <MainContentInput />
        </div>
    )
}

