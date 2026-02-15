export const mainGoFile = `package main

import (
	"fmt"
	"net/http"
	"os"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		return
	}
	fmt.Fprintf(w, "hello world")
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	if r.Method == "OPTIONS" {
		return
	}
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, "index.html")
}

func main() {
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/", indexHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port http://localhost:%s\\n", port)
	fmt.Printf("Check http://localhost:%s/hello\\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Printf("Error starting server: %s\\n", err)
	}
}
`;

export const indexHtmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Go Backend</title>
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
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
    </div>

    <!-- Main Content -->
    <div class="z-10 w-full max-w-2xl px-4">
        <div class="glass rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5 transform transition-all hover:scale-[1.01]">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center space-x-3">
                    <span class="text-4xl">🐹</span>
                    <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        welcome to Go
                    </h1>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                    <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest">Online</span>
                </div>
            </div>

            <div class="space-y-6">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Your Go backend is running and ready to handle requests.
                </p>
                
                <div class="p-4 rounded-lg bg-black/30 border border-white/10 font-mono text-sm text-gray-400">
                    <p>$ go run main.go</p>
                    <p class="text-cyan-400">>> Server started at http://localhost:8080</p>
                </div>

                <div class="pt-4 flex flex-col sm:flex-row gap-4">
                    <a href="/hello" class="group relative px-8 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold text-white transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] overflow-hidden">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            Hello Endpoint
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </a>
                    
                    <a href="https://go.dev/doc/" target="_blank" class="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/5 rounded-lg font-bold text-gray-300 transition-colors text-center">
                        Go Docs
                    </a>
                </div>
            </div>
        </div>
        
        <div class="mt-8 text-center text-sm text-gray-500">
            <p>Powered by Go Standard Library & Tailwind CSS</p>
        </div>
    </div>
</body>
</html>
`;

const files = {
    mainGoFile,
    indexHtmlFile
};

export default files;
