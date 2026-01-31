import type { ProjectTemplate } from "../../types";

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
            filecontent: "# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\ndist\ndist-ssr\n*.local\n\n# Editor directories and files\n.vscode/*\n!.vscode/extensions.json\n.idea\n.DS_Store\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?\n"
        },
        {
            action: 'file',
            file: 'README.md',
            filecontent: "# React + TypeScript + Vite\n\nThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.\n\nCurrently, two official plugins are available:\n\n- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh\n- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh\n\n## React Compiler\n\nThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).\n\n## Expanding the ESLint configuration\n\nIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:\n\n```js\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n\n      // Remove tseslint.configs.recommended and replace with this\n      tseslint.configs.recommendedTypeChecked,\n      // Alternatively, use this for stricter rules\n      tseslint.configs.strictTypeChecked,\n      // Optionally, add this for stylistic rules\n      tseslint.configs.stylisticTypeChecked,\n\n      // Other configs...\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n\nYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:\n\n```js\n// eslint.config.js\nimport reactX from 'eslint-plugin-react-x'\nimport reactDom from 'eslint-plugin-react-dom'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      // Other configs...\n      // Enable lint rules for React\n      reactX.configs['recommended-typescript'],\n      // Enable lint rules for React DOM\n      reactDom.configs.recommended,\n    ],\n    languageOptions: {\n      parserOptions: {\n        project: ['./tsconfig.node.json', './tsconfig.app.json'],\n        tsconfigRootDir: import.meta.dirname,\n      },\n      // other options...\n    },\n  },\n])\n```\n"
        },
        {
            action: 'file',
            file: 'eslint.config.js',
            filecontent: "import js from '@eslint/js'\nimport globals from 'globals'\nimport reactHooks from 'eslint-plugin-react-hooks'\nimport reactRefresh from 'eslint-plugin-react-refresh'\nimport tseslint from 'typescript-eslint'\nimport { defineConfig, globalIgnores } from 'eslint/config'\n\nexport default defineConfig([\n  globalIgnores(['dist']),\n  {\n    files: ['**/*.{ts,tsx}'],\n    extends: [\n      js.configs.recommended,\n      tseslint.configs.recommended,\n      reactHooks.configs.flat.recommended,\n      reactRefresh.configs.vite,\n    ],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n  },\n])\n"
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/logo.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>MonoChat</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n"
        },
        {
            action: 'file',
            file: 'netlify.toml',
            filecontent: "[build]\n  command = \"npm run build\"\n  publish = \"dist\"\n\n[[redirects]]\n  from = \"/*\"\n  to = \"/index.html\"\n  status = 200"
        },
        {
            action: 'file',
            file: 'package.json',
            filecontent: "{\n  \"name\": \"z-chat\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"tsc -b && vite build\",\n    \"lint\": \"eslint .\",\n    \"preview\": \"vite preview\",\n    \"stop\": \"\"\n  },\n  \"dependencies\": {\n    \"react\": \"^19.2.0\",\n    \"react-dom\": \"^19.2.0\",\n    \"zustand\": \"^4.5.7\"\n  },\n  \"devDependencies\": {\n    \"@eslint/js\": \"^9.39.1\",\n    \"@tailwindcss/postcss\": \"^4.0.0\",\n    \"@types/node\": \"^24.10.1\",\n    \"@types/react\": \"^19.2.5\",\n    \"@types/react-dom\": \"^19.2.3\",\n    \"@vitejs/plugin-react\": \"^5.1.1\",\n    \"autoprefixer\": \"^10.4.20\",\n    \"eslint\": \"^9.39.1\",\n    \"eslint-plugin-react-hooks\": \"^7.0.1\",\n    \"eslint-plugin-react-refresh\": \"^0.4.24\",\n    \"globals\": \"^16.5.0\",\n    \"jiti\": \"^2.4.2\",\n    \"postcss\": \"^8.5.1\",\n    \"tailwindcss\": \"^4.0.0\",\n    \"typescript\": \"~5.9.3\",\n    \"typescript-eslint\": \"^8.46.4\",\n    \"vite\": \"^7.2.4\"\n  },\n  \"description\": \"Vite React TS\",\n  \"fontawesomeIcon\": \"fab fa-react text-blue-500\"\n}\n"
        },
        {
            action: 'file',
            file: 'postcss.config.js',
            filecontent: "export default {\n  plugins: {\n    \"@tailwindcss/postcss\": {},\n    autoprefixer: {},\n  },\n}"
        },
        {
            action: 'file',
            file: 'public/logo.svg',
            filecontent: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\">\n  <defs>\n    <linearGradient id=\"grad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" style=\"stop-color:#6366f1;stop-opacity:1\" />\n      <stop offset=\"100%\" style=\"stop-color:#a855f7;stop-opacity:1\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"512\" height=\"512\" rx=\"128\" fill=\"url(#grad)\" />\n  <path d=\"M375.3 325.7c22.1-24.9 36.7-56.3 36.7-91.7c0-79.5-72.7-144-162-144S88 154.5 88 234s72.7 144 162 144c20.3 0 39.7-3.4 57.6-9.6L368 400l-45.7-31.3c18.5-12.7 34.6-28 47-45.7v2.7z\" fill=\"white\" />\n  <circle cx=\"178\" cy=\"234\" r=\"20\" fill=\"#6366f1\"/>\n  <circle cx=\"250\" cy=\"234\" r=\"20\" fill=\"#6366f1\"/>\n  <circle cx=\"322\" cy=\"234\" r=\"20\" fill=\"#6366f1\"/>\n</svg>\n"
        },
        {
            action: 'file',
            file: 'render.yaml',
            filecontent: "services:\n  - type: web\n    name: vite-react-app\n    env: static\n    buildCommand: npm install && npm run build\n    staticPublishPath: ./dist"
        },
        {
            action: 'file',
            file: 'src/App.tsx',
            filecontent: "import Background from './components/Background';\nimport ChatContainer from './components/ChatContainer';\nimport Header from './components/Header';\n\nexport default function App() {\n    return (\n        <div className={`\n      h-[100vh]\n      w-[100vw]\n      overflow-hidden\n      bg-zinc-900   \n    `}>\n            <div className='w-full h-full'>\n                <Background />\n                <Header />\n                <ChatContainer />\n            </div>\n        </div>\n    );\n}"
        },
        {
            action: 'file',
            file: 'src/_FetchToWho.ts',
            filecontent: "import type { ChatItem } from \"./app/chat\";\n\n//@ts-ignore\nexport default async function FetchToWho( chats: ChatItem[]) {\n    // const lastChat = chats[chats.length - 1];\n    // if (!lastChat) return;\n    // const response = await fetch(\"https://api.openai.com/v1/chat/completions\", {\n    //     method: \"POST\",\n    //     headers: {\n    //         \"Content-Type\": \"application/json\",\n    //         \"Authorization\": `Bearer ${process.env.OPENAI_API_KEY}`\n    //     },\n    //     body: JSON.stringify({\n    //         model: \"gpt-3.5-turbo\",\n    //         messages: [\n    //             { role: \"system\", content: \"You are a helpful assistant.\" },\n    //             { role: \"user\", content: lastChat.message }\n    //         ]\n    //     })\n    // });\n    // const data = await response.json();\n    // return data.choices[0].message.content;\n\n    const lorem = \"Please edit the FetchToWho function. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.\";\n    return lorem;\n}\n"
        },
        {
            action: 'file',
            file: 'src/app/chat.ts',
            filecontent: "import { create } from 'zustand';\nimport { createSelectors } from './zustandSelector';\n\nexport interface ChatItem {\n    id: number;\n    who: \"user\" | \"system\";\n    timestamp: number;\n    message: string;\n}\n\ninterface chatContext {\n    chats: Array<ChatItem>;\n    textinput: string;\n    addChat: (chat: ChatItem) => void;\n    setTextinput: (textinput: string) => void;\n}\n\nconst chatstate = create<chatContext>()((set) => ({\n    chats: [],\n    textinput: \"\",\n    addChat: (chat: ChatItem) => set((state) => ({\n        chats: [...state.chats, chat]\n    })),\n    setTextinput: (textinput: string) => set(() => ({\n        textinput: textinput\n    }))\n\n}));\n\nconst useChatState = createSelectors(chatstate);\nexport default useChatState;\n\n"
        },
        {
            action: 'file',
            file: 'src/app/zustandSelector.ts',
            filecontent: "//from: https://docs.pmnd.rs/zustand/guides/auto-generating-selectors\nimport type { StoreApi, UseBoundStore } from 'zustand'\n\ntype WithSelectors<S> = S extends { getState: () => infer T }\n  ? S & { use: { [K in keyof T]: () => T[K] } }\n  : never\n\nexport const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(\n  _store: S\n) => {\n  let store = _store as WithSelectors<typeof _store>\n  store.use = {}\n  for (let k of Object.keys(store.getState())) {\n    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])\n  }\n\n  return store\n}\n"
        },
        {
            action: 'file',
            file: 'src/components/Background.tsx',
            filecontent: "export default function Background() {\n    return (\n        <>\n            <div className=\"absolute -top-[25%] -left-[10%]  w-[80%] h-[80%] bg-blue-800/10   rounded-full blur-[128px]\"></div>\n            <div className=\"absolute bottom-[0%]  right-[0%] w-[80%] h-[40%] bg-purple-800/10 rounded-full blur-[128px]\"></div>\n        </>\n    )\n}"
        },
        {
            action: 'file',
            file: 'src/components/ChatContainer.tsx',
            filecontent: "import useChatState from '../app/chat';\nimport TextInput from './TextInput';\nimport ChatContents from './ChatContents';\n\nexport default function ChatContainer() {\n    const chats = useChatState.use.chats();\n\n    return (\n        <div className=\"flex flex-col h-[calc(100vh-6rem)] w-full max-w-[900px] mx-auto relative font-sans\">\n            {chats.length > 0 ? (\n                <>\n                    <ChatContents />\n                    <TextInput />\n                </>\n            ) : (\n                <div className=\"flex flex-col items-center justify-center h-full w-full p-4\">\n                    <div className=\"flex  gap-4 items-center justify-center\">\n                         <div className=\"w-10 h-10 mb-8\">\n                            <img src=\"/logo.svg\" alt=\"MonoChat Logo\" className=\"w-full h-full object-contain\" />\n                        </div>\n                         <h2 className=\"text-xl font-bold text-white mb-8\">How can I help you today?</h2>\n                    </div>\n                    <TextInput />\n                </div>\n            )}\n        </div>\n    );\n}\n\n"
        },
        {
            action: 'file',
            file: 'src/components/ChatContents.tsx',
            filecontent: "import { useEffect, useRef } from \"react\";\nimport useChatState from \"../app/chat\";\n\nexport default function ChatContents() {\n    const chats = useChatState.use.chats();\n    const messagesEndRef = useRef<HTMLDivElement>(null);\n\n    const scrollToBottom = () => {\n        messagesEndRef.current?.scrollIntoView({ behavior: \"smooth\" });\n    };\n\n    useEffect(() => {\n        scrollToBottom();\n    }, [chats]);\n\n    return (\n        <div className=\"flex-1 overflow-y-auto w-full px-4 scrollbar-hide\">\n            {chats.map((chat) => (\n                <div\n                    key={chat.id}\n                    className={`group flex w-full ${chat.who === 'user' ? 'justify-end' : 'justify-start'}`}\n                >\n                    <div className={`flex max-w-[85%] md:max-w-[80%] gap-4 ${chat.who === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>\n                        <div className={`flex flex-col ${chat.who === 'user' ? 'items-end' : 'items-start'}`}>\n                            <div className={`flex items-center gap-2 mb-1.5 opacity-90 ${chat.who === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>\n                                <span className=\"text-[10px] text-zinc-500\">\n                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n                                </span>\n                            </div>\n                            <div\n                                className={`relative px-5 py-3 rounded-2xl text-md leading-relaxed  transition-transform duration-200 ${chat.who === 'user'\n                                    ? 'bg-zinc-800/80 text-white rounded-tr-sm border border-zinc-700/50 shadow-lg backdrop-blur-sm'\n                                    : ' text-zinc-100'\n                                    }`}\n                            >\n                                {chat.message}\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ))}\n            <div ref={messagesEndRef} className=\"h-4\" />\n        </div>\n    )\n}"
        },
        {
            action: 'file',
            file: 'src/components/Header.tsx',
            filecontent: "\nexport default function Header() {\n    return (\n        <div className=\"w-full h-12\">\n            <div className=\"container px-4 max-w-7xl mx-auto h-full flex items-center gap-3\">\n                <img src=\"/logo.svg\" alt=\"MonoChat Logo\" className=\"w-8 h-8\" />\n                <h1 className=\"font-bold text-lg tracking-wide text-white\">\n                    MonoChat\n                </h1>\n            </div>\n        </div>\n    )\n}"
        },
        {
            action: 'file',
            file: 'src/components/SendIcon.tsx',
            filecontent: "\nexport default function SendIcon({ className }: { className?: string }) {\n    return (\n        <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" className={className}>\n             <path d=\"M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z\" />\n        </svg>\n    )\n}"
        },
        {
            action: 'file',
            file: 'src/components/TextInput.tsx',
            filecontent: "import FetchToWho from \"../_FetchToWho\";\nimport useChatState from \"../app/chat\";\nimport SendIcon       from \"./SendIcon\";\n\nexport default function TextInput() {\n    const chats          = useChatState.use.chats();\n    const textinput      = useChatState.use.textinput();\n    const setTextinput   = useChatState.use.setTextinput();\n    const addChat        = useChatState.use.addChat();\n\n    const handleSend = async () => {\n        if (!textinput.trim()) return;\n        addChat({\n            id: Date.now(),\n            who: \"user\",\n            timestamp: Date.now(),\n            message: textinput\n        });\n        setTextinput(\"\");\n\n        const userChat = chats.filter((chat) => chat.who === \"user\");\n        const response = await FetchToWho(userChat);\n        addChat({\n            id: Date.now(),\n            who: \"system\",\n            timestamp: Date.now(),\n            message: response\n        });\n    };\n\n    const handleKeyDown = (e: React.KeyboardEvent) => {\n        if (e.key === 'Enter' && !e.shiftKey) {\n            e.preventDefault();\n            handleSend();\n        }\n    };\n\n    return (\n        <div className=\"p-4 w-full\">\n            <div className=\"w-full max-w-3xl mx-auto\">\n                <div className=\"relative flex items-end gap-2 bg-zinc-900/80 hover:bg-zinc-900/90 focus-within:bg-black/90 transition-all duration-300 border border-white/10 rounded-[24px] p-2 pr-2 shadow-xl backdrop-blur-xl ring-1 ring-white/5 focus-within:ring-indigo-500/30\">\n                    <textarea\n                        value={textinput}\n                        onChange={(e) => setTextinput(e.target.value)}\n                        onKeyDown={handleKeyDown}\n                        placeholder=\"Message MonoChat...\"\n                        className=\"w-full pl-4 py-3 bg-transparent active:bg-transparent border-none outline-none focus:outline-none text-zinc-100 placeholder:text-zinc-500 focus:ring-0 resize-none max-h-48 min-h-[44px] scrollbar-hide text-md leading-6\"\n                        rows={1}\n                        style={{ height: 'auto', minHeight: '44px' }}\n                        onInput={(e) => {\n                            const target = e.target as HTMLTextAreaElement;\n                            target.style.height = 'auto';\n                            target.style.height = `${Math.min(target.scrollHeight, 192)}px`;\n                        }}\n                    />\n                    <button\n                        onClick={handleSend}\n                        disabled={!textinput.trim()}\n                        className={`p-2 rounded-full mb-1 transition-all duration-200 flex-shrink-0 ${textinput.trim()\n                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500'\n                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'\n                            }`}\n                    >\n                        <SendIcon className=\"w-5 h-5\" />\n                    </button>\n                </div>\n            </div>\n        </div>\n    )\n}\n"
        },
        {
            action: 'file',
            file: 'src/index.css',
            filecontent: "@import \"tailwindcss\";"
        },
        {
            action: 'file',
            file: 'src/main.tsx',
            filecontent: "import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)"
        },
        {
            action: 'file',
            file: 'tailwind.config.js',
            filecontent: "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    \"./index.html\",\n    \"./src/**/*.{js,ts,jsx,tsx}\",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};"
        },
        {
            action: 'file',
            file: 'tsconfig.app.json',
            filecontent: "{\n  \"compilerOptions\": {\n    \"tsBuildInfoFile\": \"./node_modules/.tmp/tsconfig.app.tsbuildinfo\",\n    \"target\": \"ES2022\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2022\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"types\": [\"vite/client\"],\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"verbatimModuleSyntax\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"erasableSyntaxOnly\": true,\n    \"noFallthroughCasesInSwitch\": true,\n    \"noUncheckedSideEffectImports\": true\n  },\n  \"include\": [\"src\"]\n}\n"
        },
        {
            action: 'file',
            file: 'tsconfig.json',
            filecontent: "{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./tsconfig.app.json\" },\n    { \"path\": \"./tsconfig.node.json\" }\n  ]\n}\n"
        },
        {
            action: 'file',
            file: 'tsconfig.node.json',
            filecontent: "{\n  \"compilerOptions\": {\n    \"tsBuildInfoFile\": \"./node_modules/.tmp/tsconfig.node.tsbuildinfo\",\n    \"target\": \"ES2023\",\n    \"lib\": [\"ES2023\"],\n    \"module\": \"ESNext\",\n    \"types\": [\"node\"],\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"verbatimModuleSyntax\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"erasableSyntaxOnly\": true,\n    \"noFallthroughCasesInSwitch\": true,\n    \"noUncheckedSideEffectImports\": true\n  },\n  \"include\": [\"vite.config.ts\"]\n}\n"
        },
        {
            action: 'file',
            file: 'vercel.json',
            filecontent: "{\n  \"rewrites\": [\n    {\n      \"source\": \"/(.*)\",\n      \"destination\": \"/index.html\"\n    }\n  ]\n}"
        },
        {
            action: 'file',
            file: 'vite.config.ts',
            filecontent: "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\n// https://vite.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n})\n"
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
