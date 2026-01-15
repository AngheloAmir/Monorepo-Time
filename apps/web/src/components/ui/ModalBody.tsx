interface ModalBodyProps {
    children: React.ReactNode | null;
    width?:  string;
}

export default function ModalBody( props: ModalBodyProps ) {
    const { children, width } = props;
    const modalWidth  = width  || "650px";

    return (
        <>
            <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div 
                    onClick={(e) => e.stopPropagation()} 
                    className={`
                        pointer-events-auto
                        relative flex flex-col
                        w-[95%] md:w-[${modalWidth}]
                        rounded-2xl overflow-hidden 
                        shadow-2xl shadow-blue-900/20 
                        animate-fade-in-up
                    `}
                    style={{ width: modalWidth }}
                >
                    {/* Gradient Border Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 pointer-events-none"></div>
                    <div className="absolute inset-[2px] bg-[#0A0A0A] rounded-[15px] pointer-events-none"></div>
                    
                    {/* Content Container */}
                    <div className="relative flex flex-col h-full bg-transparent z-10">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}