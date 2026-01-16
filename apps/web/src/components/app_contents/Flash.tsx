import { useState } from 'react';
import useAppState  from '../../appstates/app';

interface FlashProps {
    onComplete?: () => void;
}

export default function Flash({ onComplete }: FlashProps) {
    const scaffoldRepo    = useAppState.use.scaffoldRepo();
    const [step, setStep] = useState<'intro' | 'prompt' | 'scaffolding' | 'success'>('intro');
    const [scaffoldStatus, setScaffoldStatus] = useState<string>('');

    const handleScaffold = async () => {
        setStep('scaffolding');
        setScaffoldStatus('Scaffolding directories and files...');
        try {
            const data = await scaffoldRepo();
            
            if (data.success) {
                setScaffoldStatus('Scaffolding complete! Installing dependencies...');
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col relative animate-fade-in-up my-auto">
                
                {/* Header Decoration */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shrink-0"></div>

                <div className="p-6 md:p-12 flex-1">
                    {step === 'intro' && (
                        <div className="space-y-8 text-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4">
                                    <i className="fas fa-cubes text-3xl text-blue-400"></i>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block sm:inline">Monorepo TIME</span>
                                </h1>
                                <p className="text-base md:text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
                                    Your modern dashboard for managing monorepos with speed, elegance, and precision.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                                {[
                                    { icon: 'fa-project-diagram', title: 'Unified View', desc: 'Manage apps & packages in one place.' },
                                    { icon: 'fa-terminal', title: 'Web Terminal', desc: 'Run commands without leaving the UI.' },
                                    { icon: 'fa-bolt', title: 'Turborepo', desc: 'Accelerate workflows with Turbo.' },
                                ].map((feature, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                                            <i className={`fas ${feature.icon} text-blue-400`}></i>
                                        </div>
                                        <h3 className="font-semibold text-gray-200">{feature.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button 
                                    onClick={() => setStep('prompt')}
                                    className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Get Started <i className="fas fa-arrow-right ml-2 text-sm"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'prompt' && (
                        <div className="space-y-6 md:space-y-8">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-500/10 text-blue-400 mb-2">
                                    <i className="fas fa-tools text-xl md:text-2xl"></i>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">Recommended Setup</h2>
                                <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto">
                                    We noticed this might be a new project. Let's get you set up with a best-practice folder structure.
                                </p>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start gap-4">
                                <div className="p-2 bg-yellow-500/10 rounded-lg shrink-0">
                                    <i className="fas fa-exclamation-triangle text-yellow-500 text-lg"></i>
                                </div>
                                <div>
                                    <h4 className="text-yellow-500 font-semibold text-sm uppercase tracking-wider mb-1">Requirement</h4>
                                    <p className="text-yellow-200/80 text-sm leading-relaxed">
                                        This tool requires <strong className="text-white">Turborepo</strong> to function correctly. 
                                        We will generate a <code className="bg-black/30 px-1.5 py-0.5 rounded text-white font-mono text-xs">turbo.json</code> configuration 
                                        and organize your workspace for you.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 font-mono text-sm text-gray-400 overflow-x-auto">
                                <p className="mb-2 text-xs text-gray-500 uppercase tracking-widest font-semibold">Planned Structure</p>
                                <div className="space-y-2 pl-2 border-l border-gray-800 min-w-[280px]">
                                    <div className="flex items-center gap-2"><i className="fas fa-folder text-blue-500"></i> /root</div>
                                    <div className="flex items-center gap-2 pl-4"><i className="fas fa-folder text-yellow-500"></i> apps/</div>
                                    <div className="flex items-center gap-2 pl-4"><i className="fas fa-folder text-green-500"></i> packages/</div>
                                    <div className="flex items-center gap-2 pl-8 text-gray-500"><i className="fas fa-folder text-green-500/50"></i> types/</div>
                                    <div className="flex items-center gap-2 pl-4 truncate">
                                        <i className="fas fa-file-code text-purple-400 shrink-0"></i> 
                                        turbo.json 
                                        <span className="text-[10px] text-blue-400 border border-blue-400/30 px-1 rounded ml-auto">NEW</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                                <button 
                                    onClick={handleScaffold}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Scaffold & Install
                                </button>
                                <button 
                                    onClick={onComplete}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors border border-white/5"
                                >
                                    Skip setup
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'scaffolding' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Setting things up</h3>
                                <p className="text-gray-400 animate-pulse">{scaffoldStatus}</p>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <i className="fas fa-check text-4xl text-green-500"></i>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">Ready to go!</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">
                                    Your workspace has been successfully initialized. You can now start building.
                                </p>
                            </div>
                            <button 
                                onClick={onComplete}
                                className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors shadow-lg shadow-green-600/20 w-full sm:w-auto"
                            >
                                Enter Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ); 
}