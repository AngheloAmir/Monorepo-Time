import useModal from "./modals";

export default function Modal() {
    const currentModal = useModal.use.modal();
    const title = useModal.use.title();
    const message = useModal.use.message();
    const callback = useModal.use.callback();
    const hideModal = useModal.use.hideModal();
    const banner = useModal.use.banner();

    // Type Styling
    let iconClass = 'fa fa-info-circle text-blue-500';
    let btnClass = 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20';

    if (banner === 'warning') {
        iconClass = 'fa fa-exclamation-triangle text-yellow-500';
        btnClass = 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/20';
    } else if (banner === 'error') {
        iconClass = 'fa fa-times-circle text-red-500';
        btnClass = 'bg-red-600 hover:bg-red-500 shadow-red-500/20';
    } else if (banner === 'success') {
        iconClass = 'fa fa-check-circle text-green-500';
        btnClass = 'bg-green-600 hover:bg-green-500 shadow-green-500/20';
    }

    return (
        <div>
            {currentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="w-[500px] min-h-[200px] max-h-[300px] flex flex-col bg-gray-800 p-4 rounded-xl shadow-lg">
                        <div className="flex-1  ">
                            <div className="mb-2 flex gap-4">
                                <i className={`${iconClass} text-3xl`}></i>
                                <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
                            </div>
                            <p className="text-gray-300">{message}</p>
                        </div>

                        {currentModal === 'alert' && (
                             <button
                                onClick={() => {
                                    callback && callback(undefined);
                                    hideModal();
                                }}
                                autoFocus
                                className={`w-[80%] mx-auto py-2 rounded-xl text-white shadow-lg font-bold ${btnClass}`}
                            >
                                OK
                            </button>
                        )}

                        {currentModal === 'confirm' && (
                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={() => {
                                        callback && callback(false);
                                        hideModal();
                                    }}
                                    className="px-4 py-2 rounded-xl text-white bg-gray-600 hover:bg-gray-500 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        callback && callback(true);
                                        hideModal();
                                    }}
                                    className={`px-4 py-2 rounded-xl text-white shadow-lg font-bold ${btnClass}`}
                                >
                                    OK
                                </button>
                            </div>
                        )}
                       
                    </div>
                </div>
            )}
        </div>
    )
}
