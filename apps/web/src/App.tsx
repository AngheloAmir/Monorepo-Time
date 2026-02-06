import Header from './components/Header'
import Navigation from './components/ui/Navigation'
import Home from './components/app_contents/Home'

import useNavState from "./appstates/navigation";
import Workspace from './components/app_contents/Workspace';

import Modal from './modal';
import RootTerminal from './components/RootTerminal';
import useAppState from './appstates/app';
import { useEffect, useState } from 'react';
import Flash from './components/app_contents/Flash';
import Loading from './components/app_contents/_Loading';
import Turborepo from './components/app_contents/Turborepo';
import CRUDTester from './components/app_contents/CrudTester';
//import ProjectTemplate from './components/app_contents/ProjectTemplate';
import AboutModal from './components/AboutModal';
import config from 'config';
import Cloudflare from './components/app_contents/Cloudflare';
import Network from './components/app_contents/Network';

declare global {
    interface Window {
        loaded: boolean;
    }
}

export default function App() {
    const currentPage = useNavState.use.currentPage();
    const navAction = useNavState.use.action();
    const loadRootDir = useAppState.use.loadRootDir();
    const checkIfFirstTime = useAppState.use.checkIfFirstTime();
    const showAboutModal = useAppState.use.showAboutModal();
    const setShowAboutModal = useAppState.use.setShowAboutModal();
    const [isFlashVisible, setIsFlashVisible] = useState(false);
    const [loading, setLoading]               = useState(true);

    useEffect(() => {
        setLoading(false);
        if(config.useDemo && !window.loaded) {
            window.loaded = true;
            setTimeout(() => {
                alert("You are viewing a demo version. This application should be running on a local server. visit https://www.npmjs.com/package/monorepotime to know more.");
            }, 100);
            return;
        }

        setTimeout(async () => {
            const isFirstTime = await checkIfFirstTime();
            if (isFirstTime) setIsFlashVisible(true);
            await loadRootDir();
            
        }, 0);
    }, []);

    if (loading)
        return <Loading />;

    if (isFlashVisible)
        return <Flash onComplete={() => setIsFlashVisible(false)} />

    return (
        <div className='w-screen h-screen overflow-hidden bg-black relative'>
            <Header />

            <div className="flex flex-1 overflow-hidden h-full w-full ">
                <Navigation
                    navs={[
                        { 
                            name: 'dashboard',
                            label: 'Dashboard',
                            icon: 'fa fa-solid fa-house',
                            isSelected: currentPage === 'dashboard',
                            onClick: () => navAction.setCurrentPage('dashboard') 
                        },
                        { 
                            name: 'workspace',
                            label: 'Workspace',
                            icon: 'fa fa-cube',
                            isSelected: currentPage === 'workspace',
                            onClick: () => navAction.setCurrentPage('workspace') 
                        },
                        { 
                            name: 'turborepo',
                            label: 'Turborepo',
                            icon: 'fa fa-solid fa-truck-fast',
                            isSelected: currentPage === 'turborepo',
                            onClick: () => navAction.setCurrentPage('turborepo') 
                        },
                        { 
                            name: 'crud',
                            label: 'CRUD Tester',
                            icon: 'fa fa-microscope',
                            isSelected: currentPage === 'crud',
                            onClick: () => navAction.setCurrentPage('crud') 
                        },
                    ]}
                    extraNavs={[
                        { 
                            name: 'network',
                            label: 'Network & Docker',
                            icon: 'fa fa-solid fa-network-wired',
                            isSelected: currentPage === 'network',
                            onClick: () => navAction.setCurrentPage('network') 
                        },
                        { 
                            name: 'cloudflare',
                            label: 'Cloudflare Tunnel',
                            icon: 'fa fa-solid fa-cloud',
                            isSelected: currentPage === 'cloudflare',
                            onClick: () => navAction.setCurrentPage('cloudflare') 
                        },
                    ]}
                />

                <main className="flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        {/* More consistent glows using radial gradients instead of heavy blurs */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(37,99,235,0.12),transparent_45%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_35%,rgba(147,51,234,0.12),transparent_40%)]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_95%_95%,rgba(192,38,211,0.12),transparent_45%)]"></div>
                    </div>
                    <div id="app-content" className="w-full max-w-[2100px] mx-auto h-full relative z-10">
                        <Home       isVisible={currentPage === "dashboard"} />
                        <Workspace  isVisible={currentPage === "workspace"} />
                        <Turborepo  isVisible={currentPage === "turborepo"} />
                        <Cloudflare isVisible={currentPage === "cloudflare"} />
                        <Network    isVisible={currentPage === "network"} />
                        <CRUDTester isVisible={currentPage === "crud"} />
                    </div>
                </main>
            </div>

            <Modal />
            <RootTerminal />
            <AboutModal isOpen={showAboutModal} setIsOpen={() => setShowAboutModal(false)} />
        </div>
    )
}

