import { useState } from 'react';
import apiRoute from 'apiroute';
import config from 'config';

interface FlashProps {
    onComplete?: () => void;
}

export default function Flash({ onComplete }: FlashProps) {
    const [step, setStep] = useState<'intro' | 'prompt' | 'scaffolding' | 'success'>('intro');
    const [scaffoldStatus, setScaffoldStatus] = useState<string>('');

    const handleScaffold = async () => {
        setStep('scaffolding');
        setScaffoldStatus('Scaffolding directories and files...');
        try {
            const port = config.apiPort || 3000;
            const response = await fetch(`http://localhost:${port}/${apiRoute.scaffoldRepo}`);
            const data = await response.json();
            
            if (data.success) {
                setScaffoldStatus('Scaffolding complete! Installing dependencies...');
                // The backend says "Scaffolding complete" after install if needed. 
                // Wait a moment for effect
                setTimeout(() => {
                    setStep('success');
                }, 1000);
            } else {
                setScaffoldStatus(`Error: ${data.error}`);
                setTimeout(() => onComplete && onComplete(), 3000);
            }
        } catch (error) {
            console.error(error);
            setScaffoldStatus('Failed to connect to backend.');
            setTimeout(() => onComplete && onComplete(), 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 text-white overflow-hidden">
             {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-4xl p-6">
                
                {step === 'intro' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Monorepo TIME!</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                The ultimate dashboard for managing your modern monorepo architectures.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: 'fa-project-diagram', title: 'Unified Management', desc: 'Control all your packages and apps from a single view.' },
                                { icon: 'fa-terminal', title: 'Web Terminal', desc: 'Run commands directly in your browser without leaving the UI.' },
                                { icon: 'fa-bolt', title: 'Turbocharged', desc: 'Built-in support for Turborepo to speed up your workflows.' },
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl hover:bg-gray-800 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                                        <i className={`fas ${feature.icon} text-2xl text-blue-400`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <button 
                                onClick={() => setStep('prompt')}
                                className="group px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                            >
                                Get Started
                                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'prompt' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Left Column: Text & Context */}
                            <div className="text-left space-y-6">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center rotate-3">
                                    <i className="fas fa-hammer text-3xl text-blue-400"></i>
                                </div>
                                
                                <div>
                                    <h2 className="text-3xl font-bold mb-3">Recommended Setup</h2>
                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        We detected that this might be a new project. 
                                        We can scaffold a folder structure recommended by
                                        <a href="https://turborepo.org/" target="_blank" rel="noopener noreferrer" className="p-2 text-blue-400 hover:underline">
                                            Turborepo.js
                                        </a> 
                                        for you to get up and running instantly.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    This will create a <strong>packages/types</strong> folder and configure <strong>Turborepo</strong> for build orchestration.
                                </div>
                            </div>

                            {/* Right Column: Visual Folder Structure */}
                            <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 shadow-2xl font-mono text-sm text-gray-400 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <i className="fas fa-folder-tree text-6xl text-gray-800"></i>
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-folder text-blue-500"></i>
                                        <span>root</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-2 pb-1 relative">
                                        <div className="absolute left-[11px] top-0 bottom-1/2 w-px bg-gray-700"></div>
                                        <div className="absolute left-[11px] top-1/2 w-3 h-px bg-gray-700"></div>
                                        <i className="fas fa-folder text-yellow-500"></i>
                                        <span>apps</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-2 pb-1 relative">
                                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gray-700"></div>
                                        <div className="absolute left-[11px] top-1/2 w-3 h-px bg-gray-700"></div>
                                        <i className="fas fa-folder text-green-500"></i>
                                        <span className="text-green-400 font-bold">packages</span> 
                                        <span className="text-xs ml-2 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">New</span>
                                    </div>
                                    <div className="pl-12 flex items-center gap-2 pb-1 relative">
                                        <div className="absolute left-[35px] top-0 bottom-1/2 w-px bg-gray-700"></div>
                                        <div className="absolute left-[35px] top-1/2 w-3 h-px bg-gray-700"></div>
                                        <i className="fas fa-folder text-green-500"></i>
                                        <span className="text-green-400">types</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-2 pb-1 relative">
                                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gray-700"></div>
                                        <div className="absolute left-[11px] top-1/2 w-3 h-px bg-gray-700"></div>
                                        <i className="fas fa-file-code text-red-400"></i>
                                        <span>package.json</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-2 relative">
                                        <div className="absolute left-[11px] top-0 bottom-1/2 w-px bg-gray-700"></div>
                                        <div className="absolute left-[11px] top-1/2 w-3 h-px bg-gray-700"></div>
                                        <i className="fas fa-file-code text-purple-400"></i>
                                        <span className="text-purple-400 font-bold">turbo.json</span>
                                        <span className="text-xs ml-2 bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">New</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
                            <button 
                                onClick={handleScaffold}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
                            >
                                <i className="fas fa-magic mr-2"></i>
                                Yes, Scaffold & Install
                            </button>
                            <button 
                                onClick={onComplete}
                                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-semibold text-gray-300 transition-all"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                )}

                {step === 'scaffolding' && (
                    <div className="max-w-xl mx-auto text-center space-y-8 animate-pulse">
                        <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                        
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Setting things up...</h2>
                            <p className="text-gray-400">{scaffoldStatus}</p>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="max-w-xl mx-auto text-center space-y-8 animate-bounce-in">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-check text-5xl text-green-400"></i>
                        </div>
                        
                        <h2 className="text-3xl font-bold">All Set!</h2>
                        <p className="text-gray-300">
                            Your workspace has been successfully scaffolded and is now ready for action.
                        </p>

                        <button 
                            onClick={onComplete}
                            className="px-10 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white shadow-lg shadow-green-500/25 transition-all"
                        >
                            Enter Dashboard 
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}