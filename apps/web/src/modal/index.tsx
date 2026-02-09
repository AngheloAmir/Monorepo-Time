import useModal from "./modals";

export default function Modal() {
    const text = useModal.use.text();
    const setText = useModal.use.setText();

    const currentModal = useModal.use.modal();
    const title = useModal.use.title();
    const message = useModal.use.message();
    const callback = useModal.use.callback();
    const hideModal = useModal.use.hideModal();
    const banner = useModal.use.banner();
    const data = useModal.use.data();
    const placeholder = useModal.use.placeholder();

    // Type Styling
    let iconClass = 'fa fa-info-circle';
    let iconBg = 'bg-blue-500/20';
    let iconColor = 'text-blue-400';
    let btnClass = 'bg-blue-600 hover:bg-blue-500';

    if (banner === 'warning') {
        iconClass = 'fa fa-exclamation-triangle';
        iconBg = 'bg-yellow-500/20';
        iconColor = 'text-yellow-400';
        btnClass = 'bg-yellow-600 hover:bg-yellow-500';
    } else if (banner === 'error') {
        iconClass = 'fa fa-times-circle';
        iconBg = 'bg-red-500/20';
        iconColor = 'text-red-400';
        btnClass = 'bg-red-600 hover:bg-red-500';
    } else if (banner === 'success') {
        iconClass = 'fa fa-check-circle';
        iconBg = 'bg-green-500/20';
        iconColor = 'text-green-400';
        btnClass = 'bg-green-600 hover:bg-green-500';
    }

    if (!currentModal) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            {/* Modal Container */}
            <div className="relative w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-200">

                {/* Modal Content */}
                <div className="relative bg-gray-900/95 backdrop-blur-xl rounded overflow-hidden">
                    {/* Header */}
                    <div className="px-5 pt-5 pb-4">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                <i className={`${iconClass} ${iconColor} text-lg`}></i>
                            </div>
                            {/* Title & Message */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
                                <p className="text-md text-gray-400 leading-relaxed">{message}</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-5 py-4">
                        {currentModal === 'alert' && (
                            <button
                                onClick={() => {
                                    callback && callback(undefined);
                                    hideModal();
                                }}
                                autoFocus
                                className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all ${btnClass}`}
                            >
                                OK
                            </button>
                        )}

                        {currentModal === 'selection' && (
                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                                {(data as any[])?.map((item: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            callback && callback(item);
                                            hideModal();
                                        }}
                                        className="flex items-center gap-3 w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left group "
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                            <i className={`fas ${item.info.fontawesomeIcon || 'fa-box'}`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium text-sm truncate">{item.info.name}</div>
                                            <div className="text-gray-500 text-xs truncate">{item.info.path}</div>
                                        </div>
                                        <i className="fas fa-chevron-right text-gray-600 group-hover:text-gray-400 text-sm"></i>
                                    </button>
                                ))}
                                <button
                                    onClick={() => hideModal()}
                                    className="mt-2 w-full py-2.5 rounded-lg text-gray-300 text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {currentModal === 'confirm' && (
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        callback && callback(false);
                                        hideModal();
                                    }}
                                    className="px-4 py-2.5 rounded-lg text-gray-300 text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        callback && callback(true);
                                        hideModal();
                                    }}
                                    className={`px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all ${btnClass}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        )}

                        {currentModal === 'prompt' && (
                            <div className="flex flex-col gap-4">
                                <input 
                                    value={text} 
                                    placeholder={placeholder} 
                                    onChange={(e) => setText(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            callback && callback(text);
                                            hideModal();
                                        }
                                    }}
                                    autoFocus
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-lg text-white text-sm bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/5 placeholder-gray-500 transition-all" 
                                />
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => {
                                            callback && callback(false);
                                            hideModal();
                                        }}
                                        className="px-4 py-2.5 rounded-lg text-gray-300 text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            callback && callback(text);
                                            hideModal();
                                        }}
                                        className={`px-6 py-2.5 rounded-lg text-white text-sm font-medium transition-all ${btnClass}`}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
