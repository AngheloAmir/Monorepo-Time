
export default function NeonBorder({ children }: { children?: React.ReactNode }) {

    return (
        <div className="relative rounded-xl p-[1px]  bg-gradient-to-r from-blue-600/40 to-purple-600/40">
            <div className="bg-[#1A1A1A] rounded-xl h-full flex flex-col overflow-hidden">
               {children}
            </div>
        </div>
    );
}
