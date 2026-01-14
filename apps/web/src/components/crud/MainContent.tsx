import BodyInput from "./BodyInput";
import CrudExpectedOutput from "./CrudExpectedOutput";
import CrudOutput from "./CrudOutput";
import HeaderInput from "./HeaderInput";
import MainContentHeader from "./MainContentHeader";
import MainContentInput from "./MainContentInput";

export default function MainContent() {
    
    return (
        <div className="flex-1 flex flex-col relative overflow-hidden">
            <MainContentHeader />
            <MainContentInput />

            <div className="grid grid-cols-3 flex-1 pt-4 pb-6 gap-4">
                <div className="col-span-1 flex flex-col gap-4">
                   <HeaderInput />
                   <BodyInput />
                </div>

                <div className="col-span-1 ">
                    <CrudOutput output={"{\"key\": \"value\"}"} />
                </div>
                <div className="col-span-1">
                    <CrudExpectedOutput />
                </div>
            </div>
        </div>
    )
}

