import { useState } from "react";
import BaseCard from "../ui/BaseCard"
import DockerResources from "../home/DockerResources"
import SystemResources from "../home/SystemResources"
import NotesEditor from '../home/NotesEditor';
import HomeSettingsModal from "../home/HomeSettingsModal";

interface HomeProps {
    isVisible: boolean
}

export default function Home(props: HomeProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className={`h-full w-full ${props.isVisible ? 'block' : 'hidden'}`}>
            <div className="relative px-6 py-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-4 flex flex-col gap-6 h-[400px]">
                        <BaseCard>
                            <NotesEditor
                                isVisible={props.isVisible}
                            />
                        </BaseCard>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <BaseCard>
                            <SystemResources />
                        </BaseCard>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <BaseCard>
                            <DockerResources />
                        </BaseCard>
                    </div>
                </div>

                <button onClick={() => setIsSettingsOpen(true)} className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <i className="fa-solid fa-cog text-xl text-blue-400 group-hover:rotate-90 transition-transform duration-500"></i>
                </button>
            </div>

            <HomeSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    )
}
