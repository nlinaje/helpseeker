import http.server
import ssl
import socketserver
PORT = 8443
Handler = http.server.SimpleHTTPRequestHandler
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('cert.pem', 'key.pem')
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    print(f"Serving on https://YOUR_IP:{PORT}")
    httpd.serve_forever()
