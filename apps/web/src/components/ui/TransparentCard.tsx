
interface TransparentCardProps {
    title: string;
    description: string;
    children?: React.ReactNode;
    contentClassName?: string;
}

export default function TransparentCard(props: TransparentCardProps) {
    return (

        <div className="rounded bg-gray-800/30 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-3">
                <span className="text-white font-medium text-sm">
                    {props.title}
                </span>
                <span className="ml-auto text-gray-600 text-xs">{props.description}</span>
            </div>
            { props.children ? (
                <div className={props.contentClassName ?? "p-2 grid grid-cols-2 gap-2"}>
                    {props.children}
                </div>
            ) : null}
        </div>
    )
}
