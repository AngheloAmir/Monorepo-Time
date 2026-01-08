import Undercontsruct from "../components/Undercontsruct"

interface TurboCICDProps {
    isVisible : boolean
}

export default function TurboCICD( props : TurboCICDProps ) {
    return (
        <div className={ props.isVisible ? 'block' : 'hidden' }>
            <Undercontsruct pagename="TurboCICD" />
        </div>
    )
}