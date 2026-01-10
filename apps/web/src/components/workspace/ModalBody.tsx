export default function ModalBody( { children }: { children: React.ReactNode }) {
    return (
        <div onClick={close} className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/70">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 border border-gray-700 w-[80%] md:w-[50%] max-w-[600px] h-[80%] max-h-[650x] overflow-hidden flex flex-col">
                {children}
            </div>
        </div>
    );
}