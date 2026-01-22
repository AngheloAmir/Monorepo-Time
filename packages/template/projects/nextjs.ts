import type { ProjectTemplate } from "..";

export const NextJS: ProjectTemplate = {
    name: "Next.js TS",
    description: "Next.js TS template",
    notes: "Node.js and NPM must be installed.",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'npx',
            args: ['-y', 'create-next-app@latest', '.', '--typescript', '--tailwind', '--eslint', '--app', '--yes', '--use-npm']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '@heroui/react', 'framer-motion']
        },
        {
            action: 'file',
            file: 'tailwind.config.ts',
            filecontent: `import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
    extend: {
        colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        },
    },
    },
    darkMode: "class",
    plugins: [heroui()],
} satisfies Config;`
        },
        {
            action: 'file',
            file: 'app/globals.css',
            filecontent: `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}`
        },
        {
            action: 'file',
            file: 'app/providers.tsx',
            filecontent: `'use client'

import {HeroUIProvider} from '@heroui/react'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  )
}`
        },
        {
            action: 'file',
            file: 'app/layout.tsx',
            filecontent: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monorepo Time - Next.js',
  description: 'Manage your Monorepo like a Pro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <body className={inter.className}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  )
}`
        },
        {
            action: 'file',
            file: 'app/page.tsx',
            filecontent: `import { Button, Card, CardBody, CardHeader, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

export default function Home() {
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
            Speed up your workflow with current Next.js technologies.
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
            { title: "Next.js 14+", desc: "Leverage Server Components and the new App Router." },
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
}`
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-globe']
        }
    ]
};
