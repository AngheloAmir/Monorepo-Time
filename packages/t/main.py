import http.server
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
