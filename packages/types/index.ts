export interface ChildProcessInfo {
    name: string;
    pid:  number;
    mem:  number;
}

export interface DockerProcessInfo {
    id: string;
    image: string;
    status: string;
    name: string;
    memoryStr: string;
    memoryBytes: number;
}
