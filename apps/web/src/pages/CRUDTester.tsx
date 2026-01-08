import Undercontsruct from "../components/Undercontsruct"

interface CRUDTesterProps {
    isVisible : boolean
}

export default function CRUDTester( props : CRUDTesterProps ) {
    return (
        <div className={ props.isVisible ? 'block' : 'hidden' }>
            <Undercontsruct pagename="CRUDTester" />
        </div>
    )
}