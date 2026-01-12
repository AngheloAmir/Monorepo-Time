import { useState } from "react";

export default function GitControl() {
    const [gitBranches, setGitBranches]           = useState<string[]>([]);
    const [gitCommitMessage, setGitCommitMessage] = useState<string>("");
    const [prevCommit, setPrevCommit]             = useState<string>("");

    return (
        <div className="w-full h-full p-[1px] rounded-xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 transition-transform duration-300 group-hover:scale-105">
            <div className="flex bg-[#0A0A0A] rounded-xl px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80">
                <main className="w-full h-full">
                    <h2 className="text-white">Git Control</h2>
                    <button>Refresh Gits</button>
                </main>
            </div>

            <div className="flex bg-[#0A0A0A] rounded-xl px-4 py-3 transition-colors duration-300 group-hover:bg-[#0A0A0A]/80">
                <main className="w-full h-full">
                    <h2 className="text-white">
                        Input here
                    </h2>
                    <button>
                        Commit
                    </button>
                </main>
            </div>
        </div>
    )
}