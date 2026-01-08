import useModal from "../modal/modals";

export default function Undercontsruct( { pagename } : { pagename: string } ) {
    const showModal = useModal.use.showModal();

    return (
        <div className="mt-20 flex flex-col items-center justify-center h-full text-gray-500 animate-fade-in">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <i className="fas fa-hammer text-4xl text-gray-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Work in Progress</h2>
            <p className="text-gray-500 text-center max-w-sm">
                The <span 
                    className="text-blue-400 font-bold font-mono p-1"
                    onClick={() => showModal(
                        'alert',
                        'Under Construction',
                        'This feature is currently under construction.',
                        'success')}
                    >{pagename}
                </span>
                module is currently under construction.
            </p>
        </div>
    )
}