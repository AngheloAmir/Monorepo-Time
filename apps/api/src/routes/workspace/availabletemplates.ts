
import express from 'express';
import MonorepoTemplates from 'template';
import { AvailbleTemplates } from 'types';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        // Strip out the 'templating' key from each template category
        const stripTemplating = (templates: any[]) => {
            return templates.map(({ templating, ...rest }) => rest);
        };

        const availableTemplates = {
            project:    stripTemplating(MonorepoTemplates.project),
            database:   stripTemplating(MonorepoTemplates.database),
            services:   stripTemplating(MonorepoTemplates.services),
            opensource: stripTemplating(MonorepoTemplates.opensource),
            tool:       stripTemplating(MonorepoTemplates.tool),
            demo:       stripTemplating(MonorepoTemplates.demo),
        } as AvailbleTemplates;

        res.json(availableTemplates);
    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({ error: "Failed to fetch templates" });
    }
});

export default router;
