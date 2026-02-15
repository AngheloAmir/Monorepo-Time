interface AboutModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AboutModal({ isOpen, setIsOpen }: AboutModalProps) {
    if (!isOpen) return null;

    return (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden scale-100 animate-scaleIn relative flex flex-col md:flex-row"
            >
                {/* Left Column: Main App Info */}
                <div className="flex-1 p-8 flex flex-col items-center text-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
                        <img src="/logo.svg" alt="Logo" className="w-14 h-14" />
                    </div>

                    {/* Title & Version */}
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Monorepo
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200"> Time</span>
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 mb-8 leading-relaxed max-w-sm">
                        The ultimate tool for managing your monorepos with speed and style.
                        Streamline your workflow, visualize dependencies, and execute commands effortlessly.
                    </p>

                    {/** Buy me a coffe */}
                    <a
                        href="https://buymeacoffee.com/angheloamir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#FFDD00] text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,221,0,0.4)] hover:bg-[#ffe233]"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <i className="fas fa-coffee text-xl transition-transform duration-300 group-hover:rotate-12"></i>
                        <span className="relative">Buy me a coffee</span>
                    </a>
                </div>

                {/* Right Column: Acknowledgments/Inspirations */}
                <div className="w-full md:w-80 bg-white/5 p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10">
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        <span className="text-white font-medium">Disclaimer:</span> Not affiliated with the projects below.
                        We simply love these tools and provide templates to help you use them.
                    </p>

                    {/* Section 1: Core Stack */}
                    <div className="mb-6">
                        <h3 className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-3">
                            Powered By
                        </h3>
                        <AppLink name="OpenCode" url="https://opencode.ai" />
                        <AppLink name="Turborepo" url="https://turbo.build/repo" />
                        <AppLink name="Cloudflare" url="https://www.cloudflare.com" />
                    </div>

                    {/* Section 2: Templates */}
                    <div>
                        <h3 className="text-xs text-green-400 uppercase tracking-widest font-bold mb-3">
                            Integrated Templates
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <AppLink name="n8n" url="https://n8n.io" />
                            <AppLink name="LocalStack" url="https://localstack.cloud" />
                            <AppLink name="DrawDB" url="https://drawdb.vercel.app" />
                            <AppLink name="Penpot" url="https://penpot.app" />
                            <AppLink name="Mattermost" url="https://mattermost.com" />
                            <AppLink name="Nextcloud" url="https://nextcloud.com" />
                            <AppLink name="Mautic" url="https://www.mautic.org" />
                            <AppLink name="Odoo" url="https://www.odoo.com" />
                            <AppLink name="GNS3" url="https://www.gns3.com" />
                            <AppLink name="Metabase" url="https://www.metabase.com" />
                            <AppLink name="EzBookkeeping" url="https://github.com/mayswind/ezbookkeeping" />
                            <AppLink name="Peppermint" url="https://peppermint.sh" />
                            <AppLink name="Prometheus & Grafana" url="https://grafana.com" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
}

function AppLink({ name, url }: { name: string; url: string }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{name}</span>
            <i className="fas fa-external-link-alt text-xs text-gray-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
        </a>
    );
}
