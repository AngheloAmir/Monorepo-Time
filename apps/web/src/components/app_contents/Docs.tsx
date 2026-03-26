import DocBrowser from "../docs/DocBrowser";

interface DocsProps {
    isVisible: boolean;
}

export default function Docs(props: DocsProps) {
    
    return (
         <div className={`h-full w-full p-2 gap-2 ${props.isVisible ? 'flex' : 'hidden'}`}>
            <DocBrowser isVisible={props.isVisible} />
         </div>
    )
}