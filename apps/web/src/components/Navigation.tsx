import useNavState, { NavigationalPages } from "../_context/navigation"

export default function Navigation() {
    const currentPage = useNavState.use.currentPage();
    const navAction = useNavState.use.action();

    return (
        <nav id="main-nav" className="w-16 h-screen flex flex-col items-center py-4 bg-gray-900 border-r border-gray-800">
            <div className="flex flex-col gap-2 w-full px-2">
                {NavigationalPages.map((item) => {
                    return (
                        <NavButton
                            key={item.name}
                            isSelected={item.name === currentPage}
                            icon={item.icon}
                            text={item.label}
                            onClick={() => navAction.setCurrentPage(item.name)}
                        />
                    )
                })}
            </div>

            {/* <div className="mt-auto pb-12">
                <NavButton
                    isSelected={ currentPage === 'settings' }
                    icon="fa fa-cog"
                    text="Settings"
                    onClick={() => {
                        navAction.setCurrentPage('settings')
                    }}
                />
            </div> */}
        </nav>
    )
}

interface NavButton {
    isSelected: boolean;
    icon: string;
    text: string;
    onClick: () => void;
}

function NavButton(props: NavButton) {
    const activeClass = props.isSelected
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-500'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white';

    return (
        <button
            className={`nav-item group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/50 ${activeClass}`}
            id={props.text}
            onClick={props.onClick}
        >
            <i className={`${props.icon} text-lg transition-transform duration-200 group-hover:scale-110`}></i>
            <div className="z-50 absolute bg-gray-900 left-14 px-3 py-1.5 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-xl border border-gray-700 whitespace-nowrap">
                {props.text}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
            </div>
        </button>
    )
}