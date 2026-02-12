import { exec } from "child_process";

export default function runCommand(cmd: string, cwd: string): Promise<void> {
    console.log(`Running: ${cmd} in ${cwd}`);
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error("Exec error:", stderr);
                reject(error);
            } else {
                console.log(stdout);
                resolve();
            }
        });
    });
}
