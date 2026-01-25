const mainPy = `import http.server
import socketserver
import os
import sys

# Define port, default to 3000 or use environment variable
PORT = int(os.environ.get('PORT', 3000))

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Route: / -> Load index.html
        if self.path == '/':
            self.path = 'index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        
        # Route: /test -> Return "Hello World"
        elif self.path == '/test':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Hello World")
            return
            
        # Default: Serve static files
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

# Ensure index.html exists (though template should create it)
if not os.path.exists('index.html'):
    with open('index.html', 'w') as f:
        f.write("<h1>Error: index.html not found</h1>")

print(f"Python server is running at http://localhost:{PORT}")
print("Press Ctrl+C to stop.")

try:
    # Allow address reuse to prevent "Address already in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("^C received, shutting down server")
    sys.exit(0)
`;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monorepo Time - Python Backend</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'JetBrains Mono', monospace; }
        .glass {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="bg-[#0f172a] text-gray-200 min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]"></div>
    </div>

    <!-- Main Content -->
    <div class="z-10 w-full max-w-2xl px-4">
        <div class="glass rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5 transform transition-all hover:scale-[1.01]">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-3">
                    <span class="text-4xl">🐍</span>
                    <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-300">
                        Python Backend
                    </h1>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-mono text-green-400 uppercase tracking-widest">Online</span>
                </div>
            </div>

            <div class="space-y-6">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Python server is running.
                </p>
                
                <div class="p-4 rounded-lg bg-black/30 border border-white/10 font-mono text-sm text-gray-400">
                    <p>$ python main.py</p>
                    <p class="text-green-400">>> Server started at http://localhost:3000</p>
                </div>

                <div class="pt-4 flex flex-col sm:flex-row gap-4">
                    <a href="/test" class="group relative px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] overflow-hidden">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            Test Endpoint
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </a>
                    
                    <a href="https://docs.python.org/3/library/http.server.html" target="_blank" class="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/5 rounded-lg font-bold text-gray-300 transition-colors text-center">
                        Docs
                    </a>
                </div>
            </div>
        </div>
        
        <div class="mt-8 text-center text-sm text-gray-500">
            <p>Powered by Python Standard Library & Tailwind CSS</p>
        </div>
    </div>
</body>
</html>
`;

export default {
    mainPy,
    indexHtml
};
