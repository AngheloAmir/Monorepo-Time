import type { WorkspaceItem } from "../workspace";
import apiRoute from 'apiroute';
import config from 'config';
import defaultWorkspace from '../demo/defaultWorkspace';
import type { WorkspaceInfo } from "types";

const loadWorkspace = async ( set: any, get: any, ) => {
    if (config.useDemo) {
        set({ workspace: defaultWorkspace });
        return;
    }

    const isLoading = get().loading;
    if (isLoading) return;
    set({ loading: true });

    try {
        const response = await fetch(`${config.serverPath}${apiRoute.scanWorkspace}`);
        let workspaceResponse: {
            root: string;
            count: number;
            workspace: WorkspaceInfo[];
        } = await response.json() as any
        if (!response.ok) {
            throw new Error('Failed to fetch workspace');
        }

        const newWorkspace: WorkspaceItem[] = [];
        const currentWorkspace = get().workspace as WorkspaceItem[];
        workspaceResponse.workspace.forEach((item: WorkspaceInfo) => {
            //if already exist in workspace dont add to make sure data is not cleared
            //but refresh only the information
            if (currentWorkspace.find((i) => i.info.name === item.name)) {
                newWorkspace.push({
                    isRunningAs: currentWorkspace.find((i) => i.info.name === item.name)?.isRunningAs ?? null,
                    info: item
                })
            } else {
                newWorkspace.push({
                    isRunningAs: null,
                    info: item
                })
            }
        })

        //sort workspace alphabetically
        const alphabeticalWorkspace = newWorkspace.sort((a, b) => {
            if (a.info.name < b.info.name) return -1;
            if (a.info.name > b.info.name) return 1;
            return 0;
        });

        set({ workspace: alphabeticalWorkspace });
    } catch (error) {
        console.error('Error fetching workspace:', error);
    }
    set({ loading: false });
};
export default loadWorkspace;
