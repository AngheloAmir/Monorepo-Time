import type { ProjectTemplate } from "..";

export const ViteReact: ProjectTemplate = {
    name: 'Vite React TS',
    description: 'Vite React TS template',
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['create', 'vite@latest', '.', '--', '--template', 'react-ts']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'tailwindcss', '@tailwindcss/postcss', 'autoprefixer']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '@heroui/react', 'framer-motion']
        },
        {
            action: 'file',
            file: 'postcss.config.js',
            filecontent: 'export default {\n  plugins: {\n    "@tailwindcss/postcss": {},\n    autoprefixer: {},\n  },\n}'
        },
        {
            action: 'file',
            file: 'tailwind.config.js',
            filecontent: `import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};`
        },
        {
            action: 'file',
            file: 'src/index.css',
            filecontent: '@import "tailwindcss";'
        },
        {
            action: 'file',
            file: 'src/main.tsx',
            filecontent: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>,
)`
        },
        {
            action: 'command',
            cmd: 'rm',
            args: ['src/App.css']
        },
        {
            action: 'file',
            file: 'src/App.tsx',
            filecontent: `import { Button, Card, CardBody, CardHeader, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar className="bg-background/70 backdrop-blur-md border-b border-default-100">
        <NavbarBrand>
          <p className="font-bold text-inherit text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Monorepo Time</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Templates
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Manage your <span className="text-primary">Monorepo</span> like a Pro.
          </h1>
          <p className="text-xl text-default-500 max-w-2xl mx-auto leading-relaxed">
            The ultimate tool for managing workspaces, templates, and deployments. 
            Speed up your workflow with our premium suite of tools.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <Button color="primary" size="lg" variant="shadow" className="font-semibold">
              Start Building
            </Button>
            <Button variant="bordered" size="lg" className="font-semibold">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Instant Templates", desc: "Deploy React, Next.js, and API templates in seconds." },
            { title: "Workspace Management", desc: "Control all your projects from a single unified interface." },
            { title: "Docker Integration", desc: "Seamlessly manage containers and database services." }
          ].map((item, index) => (
            <Card key={index} className="py-4 border border-default-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{item.title}</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <p className="text-default-500">{item.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-default-400 text-sm border-t border-default-100 mt-auto">
        <p>© 2026 Monorepo Time. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;`
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 5173']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-globe']
        }
    ]
};
