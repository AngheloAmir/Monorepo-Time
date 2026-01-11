import Header from './components/Header'
import Navigation from './components/Navigation'
import Home from './contents/Home'

import useNavState from "./_context/navigation";
import Workspace from './contents/Workspace';

import Modal from './modal';
import RootTerminal from './components/RootTerminal';
import useAppState from './_context/app';
import { useEffect, useState } from 'react';
import Flash from './contents/Flash';
import Loading from './contents/_Loading';
import Turborepo from './contents/Turborepo';
import CRUDTester from './contents/CRUDTester';

function App() {
    const currentPage      = useNavState.use.currentPage();
    const loadRootDir      = useAppState.use.loadRootDir();
    const checkIfFirstTime = useAppState.use.checkIfFirstTime();
    const [isFlashVisible, setIsFlashVisible] = useState(false);
    const [loading, setLoading]               = useState(true);

    useEffect(() => {
        setTimeout( async () => {
            try {
                const isFirstTime = await checkIfFirstTime();
                if(isFirstTime){
                    setIsFlashVisible(true);
                }
                await loadRootDir();
            } catch (error) {
                console.error("Error checking first time:", error);
            }
            setLoading(false);
        }, 0);
    }, []);

    if(loading)
        return <Loading />;

    if(isFlashVisible)
        return <Flash onComplete={() => setIsFlashVisible(false)} />
    
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
                        <Home isVisible={currentPage === "dashboard"}/>
                        <Workspace isVisible={currentPage === "workspace"}/>
                        <Turborepo isVisible={currentPage === "turborepo"}/>
                        <CRUDTester isVisible={currentPage === "crud"}/>

                        {/* <Setting isVisible={currentPage === "settings"}/> */}
                    </div>
                </main>
            </div>
            
            <Modal />
            <RootTerminal />
        </div>
    )
}

export default App
