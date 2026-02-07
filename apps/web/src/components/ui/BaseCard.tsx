
export default function BaseCard( {children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <div className={`bg-gray-800/20 rounded-2xl p-6 flex flex-col ${className}`}>
            {children}
        </div>
    )
}