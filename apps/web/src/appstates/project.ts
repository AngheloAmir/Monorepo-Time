import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import apiRoute from 'apiroute';
import config from 'config';

export interface File {
    file: string;
    path: string;
    color: string;
}

export interface Folder {
    folder: string;
    content: ProjectTree[];
    color: string;
    path: string;
}

export type ProjectTree = File | Folder;

interface projectContext {
    projectTree: ProjectTree[];
    root: string;
    changes: number;
    openFolders: Record<string, boolean>;
    loadProjectTree: () => Promise<void>;
    toggleFolder: (path: string) => void;

    //current file open
    isFileEditorOpen: boolean;
    currentFile: string;
    currentFilePath: string;
    curentFileType: string;
    openFileEditor: (path: string) => void;
    closeFileEditor: () => void;

    isEditable: (path: string) => boolean;
    loadFile: (path: string) => Promise<string | any>;
    saveFile: (path: string, content: string) => Promise<any>;
}

const projectState = create<projectContext>()((set) => ({
    projectTree: [],
    root: "",
    changes: 0,
    openFolders: {},
    loadProjectTree: async () => {
        if (config.useDemo) return;
        const response = await fetch(`${config.serverPath}${apiRoute.scanProject}`);
        const data = await response.json();
        set({
            projectTree: data.content,
            root: data.root,
            changes: data.changes
        });
    },
    toggleFolder: (path: string) => set((state) => ({
        openFolders: {
            ...state.openFolders,
            [path]: !state.openFolders[path]
        }
    })),

    isFileEditorOpen: false,
    currentFile: "",
    currentFilePath: "",
    curentFileType: "",
    openFileEditor: (path: string) => set({
        isFileEditorOpen: true,
        currentFilePath: path,
        currentFile: path.split("/").pop() || "",
        curentFileType: path.split(".").pop() || ""
    }),
    closeFileEditor: () => set({
        isFileEditorOpen: false,
        currentFile: "",
        currentFilePath: "",
        curentFileType: ""
    }),

    isEditable: (path: string) => {
        const nonEditableExtensions = [
            'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico', 'svg', 'tiff', 'tif', 'avif',
            'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp',
            'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
            'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
            'ttf', 'otf', 'woff', 'woff2', 'eot',
            'exe', 'dll', 'so', 'dylib', 'bin', 'dat', 'db', 'sqlite'
        ];

        const ext = path.split('.').pop()?.toLowerCase();
        return !nonEditableExtensions.includes(ext || '');
    },

    loadFile: async (path: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path }),
            });
            if (!response.ok) return "";
            const data = await response.json();
            return data.content;
        } catch (e) {
            console.error(e);
            return "";
        }
    },
    saveFile: async (path: string, content: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path, content }),
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            return { error: "Failed to save" };
        }
    }
}));

const useProjectState = createSelectors(projectState);
export default useProjectState;
