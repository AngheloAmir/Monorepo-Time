import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './contents/Home'

import useNavState from "./_context/navigation";
import Workspace from './contents/Workspace';
import Turborepo from './contents/Turborepo';
import CRUDTester from './contents/CRUDTester';
import Setting from './contents/Setting';
import Modal from './modal';
import RootTerminal from './components/RootTerminal';

function App() {
    const currentPage = useNavState.use.currentPage();

    return (
        <div className='w-screen h-screen overflow-hidden'>
            <Header />

            <div className="flex flex-1 overflow-hidden ">
                <Navigation />

                <main className="flex-1 relative overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
                    </div>

                    <div id="app-content" className="w-full h-full p-2">
                        <Home isVisible={currentPage === "home"}/>
                        <Workspace isVisible={currentPage === "workspace"}/>
                        <Turborepo isVisible={currentPage === "turborepo"}/>
                        <CRUDTester isVisible={currentPage === "crud"}/>
                        <Setting isVisible={currentPage === "settings"}/>
                    </div>
                </main>
            </div>
            
            <Modal />
            <RootTerminal />
        </div>
    )
}

export default App
