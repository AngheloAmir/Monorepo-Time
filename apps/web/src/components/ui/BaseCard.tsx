export default function BaseCard( {children, className, onClick}: {children: React.ReactNode, className?: string, onClick?: () => void}) {
    return (
        <div className={`bg-gray-800/20 rounded-2xl p-6 flex flex-col ${className}`} onClick={onClick}>
            {children}
        </div>
    )
}