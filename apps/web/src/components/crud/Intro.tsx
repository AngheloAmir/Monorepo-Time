import Button from "../ui/Button";
import useAppState from "../../appstates/app";
import useCrudState from "../../appstates/crud";

export default function Intro() {
    const initMonorepoTime = useAppState.use.initMonorepoTime();
    const loadCrudData     = useCrudState.use.loadCrudData();

    return (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-gray-400 gap-8 p-4 animate-fade-in top-20">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Initialize CRUD Tester</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        A <code className="px-1.5 py-0.5 rounded bg-white/5 text-blue-300 font-mono text-xs">monorepotime.json</code> file is required to start testing and documenting your API routes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center gap-3 transition-colors hover:bg-white/10 hover:border-white/10">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <i className="fas fa-user-slash"></i>
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-1">No Sign-up</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">No accounts or logins needed. Your data stays on your machine.</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center gap-3 transition-colors hover:bg-white/10 hover:border-white/10">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <i className="fas fa-save"></i>
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-1">Local Storage</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">Everything is saved locally in <span className="text-purple-300">monorepotime.json</span> within your project root.</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center text-center gap-3 transition-colors hover:bg-white/10 hover:border-white/10">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                        <i className="fas fa-book-open"></i>
                    </div>
                    <div>
                        <h3 className="text-white font-medium mb-1">Live Documentation</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">Perfect for documenting and sharing API route configurations with your team.</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm mt-4">
                <Button
                    name="Create Configuration File"
                    description="Initialize /root/monorepotime.json"
                    icon="fa-plus"
                    color="blueIndigo"
                    onClick={async () => {
                        await initMonorepoTime();
                        await loadCrudData();
                    }}
                    className=""
                />
            </div>
        </div>
    )
}