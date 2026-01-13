
export default function GradientBody({ children }: { children?: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-b from-[#050505] to-[#191919]">
            {children}
        </div>
    );
}
