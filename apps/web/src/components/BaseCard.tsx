

export default function BaseCard( {children}: {children: React.ReactNode}) {
    return (
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 flex flex-col">
            {children}
        </div>
    )
}