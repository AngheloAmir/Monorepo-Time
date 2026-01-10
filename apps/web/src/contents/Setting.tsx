import Undercontsruct from "../components/Undercontsruct"

interface SettingProps {
    isVisible : boolean
}

export default function Setting( props : SettingProps ) {
    return (
        <div className={ props.isVisible ? 'block' : 'hidden' }>
            <Undercontsruct pagename="Setting" />
        </div>
    )
}