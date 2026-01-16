import ModalBody from "./ui/ModalBody";
import ModalHeader from "./ui/ModalHeader";

interface CICDTutorialProps {
    onClose: () => void;
}

export default function CICDTutorial({ onClose }: CICDTutorialProps) {
    return (
        <ModalBody width="900px">
            <ModalHeader 
                title="CI/CD Tutorial with Vercel" 
                description="Mastering Continuous Integration & Deployment"
                icon="fas fa-infinity"
                close={onClose}
            />
            
            <div className="flex flex-col h-[70vh] overflow-hidden text-sm">
                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-12 text-gray-300 custom-scrollbar">
                    
                    {/* Introduction */}
                    <section id="intro" className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <i className="fas fa-infinity text-2xl text-white"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">What is CI/CD?</h2>
                                <p className="text-blue-400 text-sm">Continuous Integration & Continuous Delivery</p>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <p className="leading-relaxed">
                                <strong className="text-white">CI (Continuous Integration)</strong> is the practice of automating the integration of code changes from multiple contributors into a single software project. 
                                <br/><br/>
                                <strong className="text-white">CD (Continuous Delivery/Deployment)</strong> ensures that your code is always in a deployable state and automatically releases it to production when ready.
                            </p>
                        </div>
                    </section>

                    {/* Why Use It */}
                    <section id="why" className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <i className="fas fa-lightbulb text-yellow-500"></i>
                            Why use CI/CD?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Speed', desc: 'Ship code faster with automated testing and building.', icon: 'fa-rocket', color: 'text-green-400' },
                                { title: 'Reliability', desc: 'Catch bugs early before they reach production.', icon: 'fa-shield-alt', color: 'text-blue-400' },
                                { title: 'Efficiency', desc: 'Stop wasting time on manual deployments.', icon: 'fa-clock', color: 'text-orange-400' },
                                { title: 'Consistency', desc: 'Ensure every environment matches production.', icon: 'fa-sync', color: 'text-purple-400' },
                            ].map((item) => (
                                <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                    <i className={`fas ${item.icon} ${item.color} text-xl mb-3`}></i>
                                    <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Overview */}
                    <section id="turbo-vercel" className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <i className="fas fa-layer-group text-pink-500"></i>
                                Turborepo + Vercel
                            </h2>
                        </div>
                        <div className="flex items-center gap-8 justify-center py-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-full bg-[#1e1e1e] flex items-center justify-center border border-white/20 mb-3">
                                    <i className="fas fa-cube text-3xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"></i>
                                </div>
                                <span className="font-bold text-white">Turborepo</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-green-400 font-bold">CACHE HIT!</span>
                                <div className="h-[2px] w-24 bg-gradient-to-r from-red-500 to-white"></div>
                                <i className="fas fa-arrow-right text-white"></i>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto rounded-full bg-black flex items-center justify-center border border-white/20 mb-3">
                                    <i className="fas fa-triangle text-3xl text-white"></i>
                                </div>
                                <span className="font-bold text-white">Vercel</span>
                            </div>
                        </div>
                        <p className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded text-sm">
                            Combining <strong>Turborepo's</strong> intelligent caching with <strong>Vercel's</strong> global edge network gives you the fastest build times and deployments possible. Vercel automatically understands your Turborepo structure.
                        </p>
                    </section>

                    {/* Step by Step Guide */}
                    <section id="guide" className="space-y-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <i className="fas fa-tasks text-green-500"></i>
                            Step-by-Step Setup
                        </h2>

                        <div className="space-y-6">
                            {[
                                { 
                                    step: 1, 
                                    title: "Login with Vercel", 
                                    desc: "Ensure you have a Vercel account and are logged in via the CLI or Dashboard to authorize deployments.",
                                    icon: "fa-sign-in-alt"
                                },
                                { 
                                    step: 2, 
                                    title: "Connect to GitHub", 
                                    desc: "Link your Monorepo to a GitHub repository. Vercel uses this to trigger automatic deployments on push.",
                                    icon: "fa-code-branch"
                                },
                                { 
                                    step: 3, 
                                    title: "Add Projects in Vercel", 
                                    desc: "In the Vercel Dashboard, import your repository. Vercel detects Turborepo and asks which workspace (app) you want to deploy. Add each app (e.g., 'web', 'docs') as a separate Vercel project linked to the same repo.",
                                    icon: "fa-plus-circle"
                                },
                                { 
                                    step: 4, 
                                    title: "Deployment", 
                                    desc: "Push to 'main' to deploy. Vercel will build only what has changed.",
                                    icon: "fa-cloud-upload-alt"
                                }
                            ].map((s) => (
                                <div key={s.step} className="flex gap-4">
                                    <div className="flex-none w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white border border-white/20">
                                        {s.step}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold flex items-center gap-2">
                                            {s.title}
                                            <i className={`fas ${s.icon} text-gray-500 text-sm`}></i>
                                        </h3>
                                        <p className="text-sm text-gray-400">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Turbo Build Button Note */}
                        <div className="mt-8 p-5 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/30">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <i className="fas fa-magic text-purple-400"></i>
                                Pro Tip: The "Turbo Build" Button
                            </h3>
                            <p className="text-sm text-gray-300">
                                When you use the <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">turbo build</span> command or button in this dashboard, it can be configured to upload your <strong>pre-compiled dist/build artifacts</strong> directly to Vercel's cache.
                            </p>
                            <div className="mt-3 flex items-start gap-3 text-xs text-purple-200 bg-purple-500/10 p-3 rounded-lg">
                                <i className="fas fa-info-circle mt-0.5"></i>
                                <span>
                                    This means Vercel <strong>doesn't have to rebuild</strong> everything from scratch. It pulls the artifacts you just built locally (or in CI), saving massive amounts of build minutes and time!
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer references */}
                <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center text-xs text-gray-500">
                    <span>Learn more at:</span>
                    <div className="flex gap-4">
                        <a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                            <i className="fas fa-triangle text-white"></i> Vercel Docs
                        </a>
                        <a href="https://turbo.build/repo/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                            <i className="fas fa-cube text-red-500"></i> Turborepo Docs
                        </a>
                    </div>
                </div>
            </div>
        </ModalBody>
    );
}
