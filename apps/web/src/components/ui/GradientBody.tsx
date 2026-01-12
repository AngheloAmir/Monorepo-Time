
export default function GradientBody({ children }: { children?: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-b from-black to-transparent">
            {children}
        </div>
    );
}
