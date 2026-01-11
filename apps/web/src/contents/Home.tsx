import BaseCard from "../components/BaseCard"
import DockerResources from "../components/home/DockerResources"
import SystemResources from "../components/home/SystemResources"

import { useEffect } from 'react';
import config from 'config';
import apiRoute from 'apiroute';
import useModal from '../modal/modals';
import useWorkspaceState from '../_context/workspace';

interface HomeProps {
    isVisible: boolean
}

export default function Home(props: HomeProps) {
     useEffect(() => {
        const checkTurbo = async () => {
            try {
                const response = await fetch(`http://localhost:${config.apiPort}/${apiRoute.turborepoExist}`);
                const data = await response.json();
                if (!data.exists) {
                    useModal.getState().showModal(
                        'confirm',
                        'Turborepo Missing',
                        'Would you like to scaffold this monorepo with turborepo.js?',
                        'warning',
                        async (result) => {
                            if (result) {
                                try {
                                    useModal.getState().showModal('alert', 'Processing', 'Scaffolding in progress...', 'success');
                                    
                                    const scaffoldResponse = await fetch(`http://localhost:${config.apiPort}/${apiRoute.scaffoldRepo}`);
                                    const scaffoldData = await scaffoldResponse.json();
                                    
                                    if (scaffoldData.success) {
                                        useModal.getState().showModal('alert', 'Success', 'Scaffolding complete!', 'success');
                                        useWorkspaceState.getState().loadWorkspace();
                                    } else {
                                        useModal.getState().showModal('alert', 'Error', 'Failed to scaffold: ' + (scaffoldData.details || scaffoldData.error), 'error');
                                    }
                                } catch (e) {
                                     useModal.getState().showModal('alert', 'Error', 'Failed to scaffold: ' + String(e), 'error');
                                }
                            }
                        }
                    );
                }
            } catch (error) {
                console.error("Failed to check turborepo existence", error);
            }
        };
        checkTurbo();
    }, []);

    return (
        <div className={props.isVisible ? 'block' : 'hidden'}>
            <div className="px-6 py-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    

                    {/* <!-- Real-time Monitor Card --> */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <BaseCard>
                            <SystemResources />
                        </BaseCard>
                    </div>

                    {/* <!-- Docker Monitor Card --> */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <BaseCard>
                            <DockerResources />
                        </BaseCard>
                    </div>
                </div>
            </div>
        </div>
    )
}