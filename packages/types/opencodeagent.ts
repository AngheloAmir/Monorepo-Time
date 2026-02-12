/**
 * Configuration interface for OpenCode Agent.
 * Derived from the user-provided schema.
 */
export interface OpenCodeAgentConfig {
    /** JSON schema reference for configuration validation */
    $schema?: string;
    
    /** Theme name to use for the interface */
    theme?: string;
    
    /** Custom keybind configurations */
    keybinds?: Record<string, any>;
    
    /** Log level */
    logLevel?: string;
    
    /** TUI specific settings */
    tui?: Record<string, any>;
    
    /** Server configuration for opencode serve and web commands */
    server?: ServerConfig;
    
    /** Command configuration, see https://opencode.ai/docs/commands */
    command?: Record<string, any>;
    
    /** Additional skill folder paths */
    skills?: Record<string, string>;
    
    /** Watcher configuration */
    watcher?: {
        [key: string]: any;
    };
    
    /** Plugin configuration */
    plugin?: any[];
    
    snapshot?: boolean;
    
    /** 
     * Control sharing behavior:
     * - 'manual': allows manual sharing via commands
     * - 'auto': enables automatic sharing
     * - 'disabled': disables all sharing
     */
    share?: 'manual' | 'auto' | 'disabled';
    
    /** 
     * @deprecated Use 'share' field instead. Share newly created sessions automatically 
     */
    autoshare?: boolean;
    
    /** 
     * Automatically update to the latest version. 
     * Set to true to auto-update, false to disable, or 'notify' to show update notifications 
     */
    autoupdate?: boolean | 'notify';
    
    /** Disable providers that are loaded automatically */
    disabled_providers?: string[];

    /** When set, ONLY these providers will be enabled. All other providers will be ignored */
    enabled_providers?: string[];
    
    /** Model to use in the format of provider/model, eg anthropic/claude-2 */
    model?: string;
    
    /** Small model to use for tasks like title generation in the format of provider/model */
    small_model?: string;
    
    /** Default agent to use when none is specified. Must be a primary agent. Falls back to 'build' if not set or if the specified agent is invalid. */
    default_agent?: string;
    
    /** Custom username to display in conversations instead of system username */
    username?: string;
    
    /** @deprecated Use `agent` field instead. */
    mode?: Record<string, any>;
    
    /** Agent configuration, see https://opencode.ai/docs/agents */
    agent?: Record<string, any>;
    
    /** Custom provider configurations and model overrides */
    provider?: Record<string, any>;
    
    /** MCP (Model Context Protocol) server configurations */
    mcp?: Record<string, any>;
    
    formatter?: any;
    
    lsp?: any;
    
    /** Additional instruction files or patterns to include */
    instructions?: string[];
    
    /** @deprecated Always uses stretch layout. */
    layout?: string;
    
    permission?: any;
    
    tools?: Record<string, any>;
    
    enterprise?: Record<string, any>;
    
    compaction?: Record<string, any>;
    
    experimental?: Record<string, any>;
    
    [key: string]: any; // Allow additional properties
}

export interface ServerConfig {
    [key: string]: any;
}
