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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden">
             {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-4xl p-6">
                
                {step === 'intro' && (
                    <div className="space-y-12 animate-fade-in relative">
                        <div className="text-center space-y-6">
                            <div className="inline-block p-1 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 mb-4">
                                <div className="px-4 py-1 rounded-xl bg-black/50 backdrop-blur-md">
                                    <span className="text-sm font-medium text-blue-300">v1.0.0 Alpha</span>
                                </div>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                                Welcome to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Monorepo TIME!</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                                The ultimate dashboard for managing your <span className="text-white font-medium">modern monorepo architectures</span> with speed and elegance.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: 'fa-project-diagram', title: 'Unified Management', desc: 'Control all your packages and apps from a single view.' },
                                { icon: 'fa-terminal', title: 'Web Terminal', desc: 'Run commands directly in your browser without leaving the UI.' },
                                { icon: 'fa-bolt', title: 'Turbocharged', desc: 'Built-in support for Turborepo to speed up your workflows.' },
                            ].map((feature, idx) => (
                                <div key={idx} className="group relative p-[1px] rounded-2xl transition-all duration-300 hover:-translate-y-1">
                                    {/* Gradient Border */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-300"></div>
                                    
                                    <div className="relative h-full bg-[#0A0A0A] p-6 rounded-[15px] overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-10 -mt-10"></div>
                                        
                                        <div className="w-12 h-12 bg-gray-900 rounded-xl border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/10">
                                            <i className={`fas ${feature.icon} text-2xl text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-200 transition-colors">{feature.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <button 
                                onClick={() => setStep('prompt')}
                                className="group relative px-10 py-4 rounded-xl font-bold text-lg text-white shadow-2xl shadow-blue-600/20 overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></div>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                <div className="relative z-10 flex items-center gap-3">
                                    Get Started
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'prompt' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Left Column: Text & Context */}
                            <div className="text-left space-y-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-3xl flex items-center justify-center rotate-3 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
                                    <i className="fas fa-hammer text-4xl text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400"></i>
                                </div>
                                
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Recommended Setup</h2>
                                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                                        We detected that this might be a new project. 
                                        We can scaffold a folder structure recommended by
                                        <a href="https://turborepo.org/" target="_blank" rel="noopener noreferrer" className="mx-1.5 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                                            Turborepo.js
                                        </a> 
                                        for you to get up and running instantly.
                                    </p>
                                </div>

                                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-200 text-sm flex gap-4 items-start">
                                    <i className="fas fa-info-circle mt-0.5 text-blue-400 text-lg"></i>
                                    <p>This will create a <strong className="text-white">packages/types</strong> folder and configure <strong className="text-white">Turborepo</strong> for build orchestration.</p>
                                </div>
                            </div>

                            {/* Right Column: Visual Folder Structure */}
                            <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 p-8 shadow-2xl font-mono text-sm text-gray-400 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-500">
                                    <i className="fas fa-folder-tree text-9xl text-white"></i>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-folder text-blue-500"></i>
                                        <span className="text-gray-200">root</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-3 pb-1 relative">
                                        <div className="absolute left-[11px] top-0 bottom-1/2 w-px bg-gray-800"></div>
                                        <div className="absolute left-[11px] top-1/2 w-4 h-px bg-gray-800"></div>
                                        <i className="fas fa-folder text-yellow-500"></i>
                                        <span>apps</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-3 pb-1 relative">
                                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gray-800"></div>
                                        <div className="absolute left-[11px] top-1/2 w-4 h-px bg-gray-800"></div>
                                        <i className="fas fa-folder text-green-500"></i>
                                        <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">packages</span> 
                                        <span className="text-[10px] ml-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold shadow-lg shadow-blue-500/50">NEW</span>
                                    </div>
                                    <div className="pl-12 flex items-center gap-3 pb-1 relative">
                                        <div className="absolute left-[35px] top-0 bottom-1/2 w-px bg-gray-800"></div>
                                        <div className="absolute left-[35px] top-1/2 w-4 h-px bg-gray-800"></div>
                                        <i className="fas fa-folder text-green-500"></i>
                                        <span className="text-green-400 bg-green-500/5 px-2 py-0.5 rounded">types</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-3 pb-1 relative">
                                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gray-800"></div>
                                        <div className="absolute left-[11px] top-1/2 w-4 h-px bg-gray-800"></div>
                                        <i className="fas fa-file-code text-red-400"></i>
                                        <span>package.json</span>
                                    </div>
                                    <div className="pl-6 flex items-center gap-3 relative">
                                        <div className="absolute left-[11px] top-0 bottom-1/2 w-px bg-gray-800"></div>
                                        <div className="absolute left-[11px] top-1/2 w-4 h-px bg-gray-800"></div>
                                        <i className="fas fa-file-code text-purple-400"></i>
                                        <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">turbo.json</span>
                                        <span className="text-[10px] ml-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold shadow-lg shadow-blue-500/50">NEW</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                            <button 
                                onClick={handleScaffold}
                                className="group relative px-8 py-3 rounded-xl font-bold text-white shadow-xl shadow-blue-600/20 overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></div>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                <div className="relative z-10 flex items-center gap-2">
                                    <i className="fas fa-magic"></i>
                                    Yes, Scaffold & Install
                                </div>
                            </button>
                            
                            <button 
                                onClick={onComplete}
                                className="px-8 py-3 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                )}

                {step === 'scaffolding' && (
                    <div className="max-w-xl mx-auto text-center space-y-12 animate-fade-in py-12">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <i className="fas fa-cog text-3xl text-blue-500 animate-pulse"></i>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-white">Setting things up...</h2>
                            <p className="text-gray-400 text-lg animate-pulse">{scaffoldStatus}</p>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="max-w-xl mx-auto text-center space-y-8 animate-bounce-in py-12">
                        <div className="w-28 h-28 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] ring-1 ring-green-500/30">
                            <i className="fas fa-check text-5xl text-green-400 drop-shadow-md"></i>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold text-white">All Set!</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Your workspace has been successfully scaffolded and is now ready for action.
                            </p>
                        </div>

                        <div className="pt-8">
                             <button 
                                onClick={onComplete}
                                className="group relative px-10 py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-green-600/20 overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl"></div>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                <div className="relative z-10 flex items-center gap-3">
                                    Enter Dashboard
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}