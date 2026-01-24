import type { ProjectTemplate } from "..";
import app from "./_nextapp";

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
            action: 'file',
            file: 'tailwind.config.ts',
            filecontent: `import type { Config } from "tailwindcss";

export default {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    extend: {
        colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        },
    },
    },
    plugins: [],
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
            file: 'app/layout.tsx',
            filecontent: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}`
        },
        {
            action: 'file',
            file: 'app/page.tsx',
            filecontent: app
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-js text-white']
        }
    ]
};
