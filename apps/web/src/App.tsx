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
import CRUDTester from './contents/CrudTester';
import AboutModal from './components/AboutModal';

function App() {
    const currentPage      = useNavState.use.currentPage();
    const loadRootDir      = useAppState.use.loadRootDir();
    const checkIfFirstTime = useAppState.use.checkIfFirstTime();
    const showAboutModal    = useAppState.use.showAboutModal();
    const setShowAboutModal = useAppState.use.setShowAboutModal();
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

            <div className="flex flex-1 overflow-hidden h-full w-full ">
                <Navigation />

                <main className="flex-1 relative overflow-hidden bg-black">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                         <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[128px]"></div>
                         <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[128px]"></div>
                        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[128px]"></div>
                    </div>

                    <div id="app-content" className="w-full max-w-[2100px] mx-auto h-full p-2 relative z-10">
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
            <AboutModal isOpen={showAboutModal} setIsOpen={() => setShowAboutModal(false)} />
        </div>
    )
}

export default App
