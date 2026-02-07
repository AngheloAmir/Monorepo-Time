interface NavigationProps {
    navs: NavButton[];
    extraNavs?: NavButton[];
}

interface NavButton {
    name: string;
    label: string;
    icon: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function Navigation(props :NavigationProps) {
    return (
        <nav className="w-16 h-full flex flex-col items-center py-4 bg-white/4">
            <div className="flex flex-col gap-2 w-full px-2">
                {props.navs.map((item) => {
                    return (
                        <NavButton
                            key={item.name}
                            isSelected={item.isSelected}
                            icon={item.icon}
                            name={item.name}
                            label={item.label}
                            onClick={() => item.onClick()}
                        />
                    )
                })}
            </div>

            <div className="h-full flex flex-col justify-end gap-2 mb-16">
                {props.extraNavs?.map((item) => {
                    return (
                        <NavButton
                            key={item.name}
                            isSelected={item.isSelected}
                            icon={item.icon}
                            name={item.name}
                            label={item.label}
                            onClick={() => item.onClick()}
                        />
                    )
                })}
            </div>
        </nav>
    )
}

function NavButton(props: NavButton) {
    const activeClass = props.isSelected
        ? 'bg-gradient-to-br from-blue-600 to-blue-400 text-white'
        : 'text-gray-400 hover:bg-white/5 hover:text-white';

    return (
        <button
            className={`nav-item group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 outline-none ${activeClass}`}
            onClick={props.onClick}
        >
            <i className={`${props.icon} text-lg transition-transform duration-200 group-hover:scale-110`}></i>
            <div className="z-50 absolute bg-black/90 backdrop-blur-md left-14 px-3 py-1.5 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-xl border border-white/10 whitespace-nowrap">
                {props.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/90 border-l border-b border-white/10 rotate-45"></div>
            </div>
        </button>
    )
}