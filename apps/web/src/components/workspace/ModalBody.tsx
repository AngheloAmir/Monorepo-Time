export default function ModalBody( { children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="relative w-full md:w-[600px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 animate-fade-in-up">
                {/* Gradient Border Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none"></div>
                <div className="absolute inset-[1px] bg-[#0A0A0A] rounded-[15px] pointer-events-none"></div>
                
                {/* Content Container */}
                <div className="relative flex flex-col h-full bg-transparent z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}