// Usage in Monorepo:
// 1. Add "types": "*" to the dependencies in the package.json of the apps where you want to use this.
// 2. Run "npm install" or "pnpm install" to link the packages.
// 3. Import it in your code:
//    import config, { HELLO_WORD } from "types";

export interface HELLO_WORD {
    text: string;
}

const config = {
    apiPort: 3000,
}

export default config;
