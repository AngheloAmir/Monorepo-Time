import { useEffect, useState } from "react";
import useWorkspaceState, { type WorkspaceItem } from "../../_context/workspace";
import Button from "../Button";

export default function WorkSpaceCardButtons(props: WorkspaceItem) {
    const loadingWorkspace = useWorkspaceState.use.loadingWorkspace();
    const setWorkSpaceRunningAs = useWorkspaceState.use.setWorkSpaceRunningAs();
    const setActiveTerminal = useWorkspaceState.use.setActiveTerminal();
    const stopInteractiveTerminal = useWorkspaceState.use.stopInteractiveTerminal();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loadingWorkspace == props.info.name) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [loadingWorkspace]);

    return (
        <div className="flex-1 flex gap-2">
            <Button
                onClick={() => { }}
                name={"Loading"}
                description={"..."}
                color="blueIndigo"
                icon="fas fa-check-circle"
                disabled={true}
                render={loading}
            />

            <Button
                onClick={async () => {
                    await stopInteractiveTerminal(props.info.name);
                    setWorkSpaceRunningAs(props.info.name, null);
                }}
                name={"App is Running"}
                description={"Click to stop"}
                color="orangePurple"
                icon="fas fa-check-circle"
                disabled={false}
                render={!loading && props.isRunningAs == 'start'}
            />

            <Button
                onClick={async () => {
                    await stopInteractiveTerminal(props.info.name);
                    setWorkSpaceRunningAs(props.info.name, null);
                }}
                name={"Development Server"}
                description={"Click to stop"}
                color="emeraldTeal"
                icon="fas fa-check-circle"
                disabled={false}
                render={!loading && props.isRunningAs == 'dev'}
                bordered={ props.isRunningAs == 'dev' }
            />

            <Button
                onClick={() => {
                    setLoading(true);
                    setWorkSpaceRunningAs(props.info.name, 'start');
                    setActiveTerminal(props.info.name);
                    setTimeout(() => setLoading(false), 1000);
                }}
                name={"Start"}
                description={"npm run start"}
                color="orangePurple"
                icon="fas fa-play"
                disabled={false}

                render={
                    (!loading &&
                        props.isRunningAs != 'dev' &&
                        props.isRunningAs != 'start' &&
                        props.isRunningAs != 'crashed' &&
                        props.info.startCommand
                    ) ? true : false
                }
            />

            <Button
                onClick={() => {
                    setLoading(true);
                    setWorkSpaceRunningAs(props.info.name, 'dev');
                    setActiveTerminal(props.info.name);
                    setTimeout(() => setLoading(false), 1000);
                }}
                name={"Dev"}
                description={"npm run dev"}
                color="blueIndigo"
                icon="fas fa-code"
                disabled={false}
                render={(
                    !loading &&
                    props.isRunningAs != 'dev' &&
                    props.isRunningAs != 'start' &&
                    props.isRunningAs != 'crashed' &&
                    props.info.devCommand
                ) ? true : false}
            />

            <Button
                onClick={async () => {
                    stopInteractiveTerminal(props.info.name, true);
                    setWorkSpaceRunningAs(props.info.name, null);
                }}
                name={"Crashed"}
                description={"Crashed"}
                color="red"
                icon="fas fa-code"
                disabled={false}
                render={!loading && props.isRunningAs == 'crashed'}
                bordered={true}
            />
        </div>
    )
}