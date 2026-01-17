const apiRoute = {
    /** Scan a workspace 
     * get request returns  workspace: WorkspaceInfo[]
    */
    scanWorkspace:     'scanworkspace',

    /** Run a command in the interactive terminal 
     * request body: { workspace: WorkspaceInfo; runas: 'dev' | 'start'; }
    */
    runCmdDev:         'runcmddev',
    /** Stop a process 
     * request body: { workspace: WorkspaceInfo }
    */
    stopProcess:       'stopprocess',

    /** List all workspaces in the workspace directory 
     * It is a get request
     * returns: [{ label: string, path: string }]
    */
    listWorkspacesDir: 'listworkspacedirs',

    /** Create a new workspace 
     * request body: { workspace: WorkspaceInfo }
    */
    newWorkspace:      'newworkspace',

    /** Run a command in the interactive terminal 
     * request body: { path: string, cmd: string }
    */
    interactvTerminal: 'interactvterminal',
    stopInteractiveTerminal: 'stopinteractiveterminal',

    /** Hide or show a file or folder in your IDE (VS Code and variant)
     * it a get request, return true / false
    */
    hideShowFileFolder: 'hideshowfilefolder',


    /** Update a workspace 
     * request body: { workspace: WorkspaceInfo }
    */
    updateWorkspace: 'updateworkspace',
    
    /** Get the root path of the project
     * It is a get request
     * returns: { path: string }
    */
    getRootPath: 'getrootpath',


    /** Scaffold a new repo 
     * get request returns { success: boolean }
    */
    scaffoldRepo:   'scaffoldrepo',

    /** Check if a turbo repo exists in the rootdir 
     * get return { exists: boolean }
    */
    turborepoExist: 'turborepoexist',


    /** Check if it is the first run
     * get return { isFirstTime: boolean }
    */
    firstRun: 'firstrun',

    /** Get/Set notes
     * get returns { notes: string }
     * post body { notes: string } returns { success: boolean }
    */
    notes: 'notes',

    /** Get/Set crudtest
     * get returns { crudtest: any[] }
     * post body { crudtest: any[] } returns { success: boolean }
    */
    crudTest: 'crudtest',
    
    /** Git Control
     * get history
     * get current branch
     * post revert
     * post push
     */
    gitControl: 'gitcontrol',

    /** Initialize monorepotime.json
     * get request returns { success: boolean }
     */
    initMonorepoTime: 'initmtime',

    /** Process tree and dockers memory usage */
    processTree: 'processtree',

    /** Docker API */
    docker: 'docker',

    availabletemplates: 'availabletemplates',

    setWorkspaceTemplate: 'setworkspacetemplate',
}

export default apiRoute;