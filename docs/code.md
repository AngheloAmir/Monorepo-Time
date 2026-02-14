http://localhost:4096/provider?directory=$PWD and  http://localhost:4096/config?directory=$PWD and  http://localhost:4096/agent?directory=$PWD,

# 1. Get User Configuration
curl -s "http://localhost:4096/config?directory=$PWD"

# 2. Get Provider Defaults
curl -s "http://localhost:4096/provider?directory=$PWD"

async function getDefaults(projectPath) {
  const baseUrl = "http://localhost:4096";
  const params = new URLSearchParams({ directory: projectPath });

  // 1. Fetch Data
  const [agentsRaw, config, providers] = await Promise.all([
    fetch(`${baseUrl}/agent?${params}`).then(r => r.json()),
    fetch(`${baseUrl}/config?${params}`).then(r => r.json()),
    fetch(`${baseUrl}/provider?${params}`).then(r => r.json())
  ]);

  // 2. Resolve Default Agent
  // Filter out subagents and hidden agents
  const agents = agentsRaw.filter(a => a.mode !== 'subagent' && !a.hidden);
  const defaultAgent = agents[0];

  // 3. Resolve Default Model
  let defaultModel = null;

  // Priority A: Check Config (User override)
  if (config.model) {
    // config.model is a string "provider/model"
    const [providerID, modelID] = config.model.split('/');
    defaultModel = { providerID, modelID, source: 'config' };
  }
  
  // Priority B: Check Provider Default (if no config)
  if (!defaultModel && providers.default) {
    // providers.default is a map: { "openai": "gpt-4", ... }
    // We try to find a default for any connected provider
    const connectedProviders = providers.all.filter(p => p.models && Object.keys(p.models).length > 0);
    
    for (const provider of connectedProviders) {
      const modelID = providers.default[provider.id];
      if (modelID) {
        defaultModel = { providerID: provider.id, modelID, source: 'provider_default' };
        break;
      }
    }
  }

  // Priority C: Fallback to first available model
  if (!defaultModel) {
    const firstProvider = providers.all.find(p => p.models && Object.keys(p.models).length > 0);
    if (firstProvider) {
      const firstModelID = Object.keys(firstProvider.models)[0];
      defaultModel = { providerID: firstProvider.id, modelID: firstModelID, source: 'fallback' };
    }
  }

  return { agents, defaultAgent, defaultModel };
}

// Usage
getDefaults(process.cwd()).then(console.log);




router.get("/defaults", async (req: Request, res: Response) => {
    try {
        const directory = ROOT;
        let baseUrl = "http://localhost:4096";

        // Try to use an existing instance if available
        if (opencodeInstances.size > 0) {
            const firstInstance = opencodeInstances.values().next().value;
            if (firstInstance?.port) {
                baseUrl = `http://localhost:${firstInstance.port}`;
            }
        }

        const params = new URLSearchParams({ directory });

        // 1. Fetch Data
        const [agentsRaw, config, providers] = await Promise.all([
            fetch(`${baseUrl}/agent?${params}`).then(r => r.json()).catch(() => []),
            fetch(`${baseUrl}/config?${params}`).then(r => r.json()).catch(() => ({})),
            fetch(`${baseUrl}/provider?${params}`).then(r => r.json()).catch(() => ({}))
        ]);

        // 2. Resolve Default Agent
        // Filter out subagents and hidden agents
        const agents = Array.isArray(agentsRaw) ? agentsRaw.filter((a: any) => a.mode !== 'subagent' && !a.hidden) : [];
        const defaultAgent = agents[0];

        // 3. Resolve Default Model
        let defaultModel = null;

        // Priority A: Check Config (User override)
        if (config.model) {
            // config.model is a string "provider/model"
            const [providerID, modelID] = config.model.split('/');
            defaultModel = { providerID, modelID, source: 'config' };
        }

        // Priority B: Check Provider Default (if no config)
        if (!defaultModel && providers.default) {
            // providers.default is a map: { "openai": "gpt-4", ... }
            // We try to find a default for any connected provider
            const allProviders = Array.isArray(providers.all) ? providers.all : [];
            const connectedProviders = allProviders.filter((p: any) => p.models && Object.keys(p.models).length > 0);

            for (const provider of connectedProviders) {
                const modelID = providers.default[provider.id];
                if (modelID) {
                    defaultModel = { providerID: provider.id, modelID, source: 'provider_default' };
                    break;
                }
            }
        }

        // Priority C: Fallback to first available model
        if (!defaultModel) {
            const allProviders = Array.isArray(providers.all) ? providers.all : [];
            const firstProvider = allProviders.find((p: any) => p.models && Object.keys(p.models).length > 0);
            if (firstProvider) {
                const firstModelID = Object.keys(firstProvider.models)[0];
                defaultModel = { providerID: firstProvider.id, modelID: firstModelID, source: 'fallback' };
            }
        }

        res.json({ agents, defaultAgent, defaultModel });
    } catch (error) {
        console.error("Error fetching defaults:", error);
        res.status(500).json({ error: "Failed to fetch defaults from OpenCode instance", details: String(error) });
    }
});