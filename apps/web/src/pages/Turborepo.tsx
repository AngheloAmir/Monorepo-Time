import Undercontsruct from "../components/Undercontsruct"

interface TurborepoProps {
    isVisible : boolean
}

export default function Turborepo( props : TurborepoProps ) {
    return (
        <div className={ props.isVisible ? 'block' : 'hidden' }>
           <Undercontsruct pagename="Turborepo" />
        </div>
    )
}