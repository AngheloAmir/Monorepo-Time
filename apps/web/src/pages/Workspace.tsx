import Undercontsruct from "../components/Undercontsruct"

interface WorkspaceProps {
    isVisible : boolean
}

export default function Workspace( props : WorkspaceProps ) {
    return (
        <div className={ props.isVisible ? 'block' : 'hidden' }>
            <Undercontsruct pagename="Workspace" />
        </div>
    )
}