
export default function GradientBody({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-[#111] ${className}`}>
            {children}
        </div>
    );
}
