import { Request, Response, Router } from "express";

import AddPackageJsonIfNotExist  from "./scafoldrepo/addPackageJsonIfNotExist";
import SetupWorkspacesIfNotExist from "./scafoldrepo/setupWorkspacesIfNotExist";
import InstallTurborepoIfNotYet  from "./scafoldrepo/installTurborepoIfNotYet";
import AddTurboJsonIfNotExist    from "./scafoldrepo/addTurboJsonIfNotExist";
import CreateGitIgnoreIfNotExist from "./scafoldrepo/createGitIgnoreIfNotExist";
import InitializeGitIfNotExist   from "./scafoldrepo/initializeGitIfNotExist";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        await AddPackageJsonIfNotExist();
        await SetupWorkspacesIfNotExist();
        await InstallTurborepoIfNotYet();
        await AddTurboJsonIfNotExist();
        await CreateGitIgnoreIfNotExist();
        await InitializeGitIfNotExist();

        console.log("Scaffolding complete");
        res.json({ success: true, message: "Scaffolding complete" });
    } catch (error) {
        console.error("Scaffolding error:", error);
        res.status(500).json({
            error: "Failed to scaffold",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
