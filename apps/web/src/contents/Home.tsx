// import Undercontsruct from "../components/Undercontsruct"

import BaseCard from "../components/BaseCard"
import DockerResources from "../components/home/DockerResources"
import SystemResources from "../components/home/SystemResources"

interface HomeProps {
    isVisible: boolean
}

export default function Home(props: HomeProps) {
    return (
        <div className={props.isVisible ? 'block' : 'hidden'}>
            <div className="px-6 py-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 p-5 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-black/50">
                            <div className="absolute top-0 right-0 w-[500px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="space-y-6 max-w-2xl relative z-10">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                    Monorepo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                        TIME!
                                    </span>
                                </h1>
                                <p className="text-sm text-gray-300 leading-relaxed font-light">
                                    Orchestrate your microservices, manage deployments, and monitor system health from a unified,
                                    high-performance interface.
                                </p>
                            </div>

                            {/* <!-- Decorative Icon --> */}
                            <div className="relative flex-shrink-0 animate-float">
                                <div
                                    className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-xl transform rotate-3">
                                    <i className="fas fa-boxes text-6xl md:text-7xl text-white/90 drop-shadow-lg"></i>
                                </div>
                                {/* <!-- Back element for depth --> */}
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl -z-10"></div>
                            </div>
                        </div>
                    </div>

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