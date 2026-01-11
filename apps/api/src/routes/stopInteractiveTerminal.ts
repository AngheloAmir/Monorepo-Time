import { Request, Response, Router } from 'express';
import { stopTerminalProcess, stopTerminalProcessByName } from './interactiveTerminal';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { socketId, workspace } = req.body;

    if (workspace && workspace.name) {
        const stopped = stopTerminalProcessByName(workspace.name);
        if (stopped) {
            res.json({ success: true, message: `Terminated process for workspace ${workspace.name}` });
        } else {
            res.status(404).json({ success: false, message: `No active terminal process found for workspace ${workspace.name}` });
        }
        return;
    }

    if (socketId) {
        const stopped = stopTerminalProcess(socketId);
        if (stopped) {
            res.json({ success: true, message: `Terminated process for socket ${socketId}` });
        } else {
            res.status(404).json({ success: false, message: `No active terminal process found for socket ${socketId}` });
        }
        return;
    }

    res.status(400).json({ message: 'Missing socketId or workspace.name' });
});

export default router;
