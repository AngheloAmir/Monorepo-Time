import Undercontsruct from "../components/Undercontsruct"

interface HomeProps {
    isVisible : boolean
}

export default function Home( props : HomeProps ) {
    return (
        <div className={ props.isVisible ? 'block' : 'hidden' }>
            <Undercontsruct pagename="Home" />
        </div>
    )
}