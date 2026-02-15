// Vite dynamically replaces process.env.NODE_ENV during build
declare var process: any;
const isDev = process.env.NODE_ENV === 'development';
const port  = 4792;

const config = {
    apiPort:    port,
    serverPath: isDev ? `http://localhost:${port}/` : "/",
    useDemo:    false,
    isDev:      isDev,
}

export default config;