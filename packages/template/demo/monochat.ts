import type { ProjectTemplate } from "../../types";
import { gitignore } from "./monochat/gitignore";
import { readme } from "./monochat/readme";
import { eslintConfig } from "./monochat/eslintConfig";
import { indexHtml } from "./monochat/indexHtml";
import { netlifyToml } from "./monochat/netlifyToml";
import { packageJson } from "./monochat/packageJson";
import { postcssConfig } from "./monochat/postcssConfig";
import { logoSvg } from "./monochat/logoSvg";
import { renderYaml } from "./monochat/renderYaml";

import { AppTsx } from "./monochat/src/App";
import { FetchToWhoTs } from "./monochat/src/FetchToWho";
import { chatTs } from "./monochat/src/app/chat";
import { zustandSelectorTs } from "./monochat/src/app/zustandSelector";
import { BackgroundTsx } from "./monochat/src/components/Background";
import { ChatContainerTsx } from "./monochat/src/components/ChatContainer";
import { ChatContentsTsx } from "./monochat/src/components/ChatContents";
import { HeaderTsx } from "./monochat/src/components/Header";
import { SendIconTsx } from "./monochat/src/components/SendIcon";
import { TextInputTsx } from "./monochat/src/components/TextInput";
import { indexCss } from "./monochat/src/indexCss";
import { mainTsx } from "./monochat/src/main";

import { tailwindConfigJs } from "./monochat/tailwindConfig";
import { tsconfigAppJson } from "./monochat/tsconfigApp";
import { tsconfigJson } from "./monochat/tsconfig";
import { tsconfigNodeJson } from "./monochat/tsconfigNode";
import { vercelJson } from "./monochat/vercel";
import { viteConfigTs } from "./monochat/viteConfig";

const MonoChat: ProjectTemplate = {
    name: "Chat To MonoChat",
    description: "React Frontend, needs custom backend",
    notes: "Vite React + TailwindCSS + TypeScript",
    type: "app",
    category: "Demo",
    icon: "fas fa-comments text-green-500",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: gitignore
        },
        {
            action: 'file',
            file: 'README.md',
            filecontent: readme
        },
        {
            action: 'file',
            file: 'eslint.config.js',
            filecontent: eslintConfig
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: indexHtml
        },
        {
            action: 'file',
            file: 'netlify.toml',
            filecontent: netlifyToml
        },
        {
            action: 'file',
            file: 'package.json',
            filecontent: packageJson
        },
        {
            action: 'file',
            file: 'postcss.config.js',
            filecontent: postcssConfig
        },
        {
            action: 'file',
            file: 'public/logo.svg',
            filecontent: logoSvg
        },
        {
            action: 'file',
            file: 'render.yaml',
            filecontent: renderYaml
        },
        {
            action: 'file',
            file: 'src/App.tsx',
            filecontent: AppTsx
        },
        {
            action: 'file',
            file: 'src/_FetchToWho.ts',
            filecontent: FetchToWhoTs
        },
        {
            action: 'file',
            file: 'src/app/chat.ts',
            filecontent: chatTs
        },
        {
            action: 'file',
            file: 'src/app/zustandSelector.ts',
            filecontent: zustandSelectorTs
        },
        {
            action: 'file',
            file: 'src/components/Background.tsx',
            filecontent: BackgroundTsx
        },
        {
            action: 'file',
            file: 'src/components/ChatContainer.tsx',
            filecontent: ChatContainerTsx
        },
        {
            action: 'file',
            file: 'src/components/ChatContents.tsx',
            filecontent: ChatContentsTsx
        },
        {
            action: 'file',
            file: 'src/components/Header.tsx',
            filecontent: HeaderTsx
        },
        {
            action: 'file',
            file: 'src/components/SendIcon.tsx',
            filecontent: SendIconTsx
        },
        {
            action: 'file',
            file: 'src/components/TextInput.tsx',
            filecontent: TextInputTsx
        },
        {
            action: 'file',
            file: 'src/index.css',
            filecontent: indexCss
        },
        {
            action: 'file',
            file: 'src/main.tsx',
            filecontent: mainTsx
        },
        {
            action: 'file',
            file: 'tailwind.config.js',
            filecontent: tailwindConfigJs
        },
        {
            action: 'file',
            file: 'tsconfig.app.json',
            filecontent: tsconfigAppJson
        },
        {
            action: 'file',
            file: 'tsconfig.json',
            filecontent: tsconfigJson
        },
        {
            action: 'file',
            file: 'tsconfig.node.json',
            filecontent: tsconfigNodeJson
        },
        {
            action: 'file',
            file: 'vercel.json',
            filecontent: vercelJson
        },
        {
            action: 'file',
            file: 'vite.config.ts',
            filecontent: viteConfigTs
        },
        {
            action: "command",
            cmd: 'npm',
            args: ['install']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-comments text-green-500']
        }
    ]
}

export default MonoChat;
