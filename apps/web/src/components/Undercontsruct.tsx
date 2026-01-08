export default function Undercontsruct( { pagename } : { pagename: string } ) {
    return (
        <div className="mt-20 flex flex-col items-center justify-center h-full text-gray-500 animate-fade-in">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <i className="fas fa-hammer text-4xl text-gray-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Work in Progress</h2>
            <p className="text-gray-500 text-center max-w-sm">
                The <span className="text-blue-400 font-mono">{pagename}</span>
                module is currently under construction.
            </p>
        </div>
    )
}