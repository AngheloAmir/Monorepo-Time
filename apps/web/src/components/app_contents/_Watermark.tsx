export default function Watermark() {
    return (
        <div className="fixed bottom-12 right-12 z-[100] opacity-30 pointer-events-none select-none no-print mix-blend-screen">
            <div className="relative w-48 h-48 rounded-full border-[6px] border-double border-red-500/60 flex items-center justify-center -rotate-[25deg] shadow-[0_0_30px_rgba(220,38,38,0.3)] bg-red-900/10 backdrop-blur-[1px]">
                <div className="absolute inset-2 border border-dashed border-red-500/40 rounded-full animate-pulse"></div>
                <div className="absolute w-[120%] bg-black/90 border-y-2 border-red-500/60 py-2 flex flex-col items-center justify-center shadow-2xl skew-x-[-12deg]">
                    <span className="text-red-500 font-black text-2xl tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
                        DEMO
                    </span>
                    <div className="flex flex-col items-center gap-[2px] mt-1 border-t border-red-500/20 pt-1 w-[80%]">
                        <span className="text-red-400/80 font-semibold text-[0.6rem] tracking-[0.2em] uppercase">
                            Must Run In
                        </span>
                        <span className="text-red-400/80 font-semibold text-[0.6rem] tracking-[0.2em] uppercase">
                            Local Machine
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}