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

    //current active path
    selectedPath:   string;
    selectedFolder: string;
    setSelectedPath: (path: string) => void;
    getParentPath: () => string;

    //api call
    createNewFile: (path: string) => Promise<any>;
    createNewFolder: (path: string) => Promise<any>;

    delete: (path: string) => Promise<any>;
    rename: (path: string, newname: string) => Promise<any>;

    getFileDiff: (path: string) => Promise<any>;
}

const projectState = create<projectContext>()((set, get) => ({
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

    selectedPath: "",
    selectedFolder: "",
    setSelectedPath: (path: string) => set(() => {
        const segments = path.split("/").filter(s => s !== "");
        const lastSegment = segments[segments.length - 1] || "";
        const isFile = lastSegment.includes(".");
        let folder: string;
        if (isFile) {
            segments.pop();
            folder = segments.pop() || "/";
        } else {
            folder = segments.pop() || "/";
        }
        return {
            selectedPath: path,
            selectedFolder: folder
        }
    }),
    getParentPath: () => {
        const { selectedPath, root } = get();
        if (!selectedPath) return root;
        
        // selectedPath is already an absolute path
        // For files, return the parent directory; for folders, return the path as-is
        const lastSegment = selectedPath.split("/").pop() || "";
        const isFile = lastSegment.includes(".");
        
        if (isFile) {
            // Return the parent directory of the file
            const parentPath = selectedPath.substring(0, selectedPath.lastIndexOf("/"));
            return parentPath || root;
        }
        
        // For folders, return the selected folder path (create new items inside it)
        return selectedPath;
    },

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
    },

    //api call
    createNewFile: async (path: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/newfile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path }),
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            return { error: "Failed to create" };
        }
    },

    createNewFolder: async (path: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/newfolder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path }),
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            return { error: "Failed to create" };
        }
    },

    delete: async (path: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path }),
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            return { error: "Failed to delete" };
        }
    },
    rename: async (path: string, newname: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/edit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path, newname }),
            });
            return await response.json();
        } catch (e) {
            console.error(e);
            return { error: "Failed to rename" };
        }
    },

    getFileDiff: async (path: string) => {
        try {
            const response = await fetch(`${config.serverPath}${apiRoute.textEditor}/diff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path }),
            });
            if (!response.ok) return { added: [], modified: [] };
            return await response.json();
        } catch (e) {
            console.error(e);
            return { added: [], modified: [] };
        }
    }
}));

const useProjectState = createSelectors(projectState);
export default useProjectState;
