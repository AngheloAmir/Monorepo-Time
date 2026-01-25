const file = `import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">M</div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Monorepo Time
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">Features</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-slate-800/50 border border-slate-700/50">Templates</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">Integrations</a>
              </div>
            </div>
            <div>
              <a href="#" className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-lg shadow-white/5">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 is now available
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Manage your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Monorepo</span> like a Pro.
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate tool for managing workspaces, templates, and deployments. 
            Speed up your workflow with our premium suite of tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
              Start Building
            </button>
            <button className="px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-semibold text-lg transition-all hover:-translate-y-0.5">
              View Documentation
            </button>
          </div>
        </div>
        
        {/* Background gradient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950 relative">
        <div className="absolute inset-0 bg-slate-900/20 skew-y-3 transform origin-top-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Instant Templates", desc: "Deploy React, Next.js, and API templates in seconds.", icon: "⚡" },
              { title: "Workspace Management", desc: "Control all your projects from a single unified interface.", icon: "🛠️" },
              { title: "Docker Integration", desc: "Seamlessly manage containers and database services.", icon: "🐳" }
            ].map((item, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all hover:bg-slate-800/50">
                <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform group-hover:border-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">M</div>
          <span className="font-bold text-slate-200">Monorepo Time</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 Monorepo Time. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App`

export default file;