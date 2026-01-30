import useWorkspaceState from "../../../appstates/workspace";
import HeaderItem from "./HeaderItem";

export default function TabTerminalHeaderContainer({ whichShow }: { whichShow: string }) {
    const workspace = useWorkspaceState.use.workspace();

    return (
        <>
            {workspace.map((item) => {
                if (item.isRunningAs != null &&
                    (
                        //show all==============================
                        (whichShow === "all") ||
                        //show apps and databases===============
                        (whichShow === "apps" && (item.info.appType === undefined || item.info.appType === "database")) ||
                        //show tools only======================
                        (whichShow === "tools" && item.info.appType === "tool")
                    ))
                    return <HeaderItem key={item.info.name} workspace={item} />
            })}
        </>
    )
}