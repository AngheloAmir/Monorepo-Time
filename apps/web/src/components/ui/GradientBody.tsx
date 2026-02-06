
export default function GradientBody({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-gradient-to-b from-[#050505] to-[#191919] ${className}`}>
            {children}
        </div>
    );
}
