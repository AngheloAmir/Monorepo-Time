import useWorkspaceState from "../../../appstates/workspace";
import HeaderItem from "./HeaderItem";

export default function TabTerminalHeaderContainer({ whichShow }: { whichShow: string }) {
    const workspace = useWorkspaceState.use.workspace();

    return (
        <>
            {workspace.map((item) => {
                if (item.isRunningAs != null &&
                    (
                        (whichShow === "all") ||
                        (whichShow === item.info.workspace)
                    ))
                    return <HeaderItem key={item.info.name} workspace={item} />
            })}
        </>
    )
}