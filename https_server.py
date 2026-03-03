"""
HTTPS dev server for HelpSeeker PWA.
Serves the current directory over TLS using the self-signed certs from pwa-test/.

Usage (from apps/help-seeker/):
    python3 https_server.py

Then open https://YOUR_LAN_IP:8443 on any device on the same network.
"""
import http.server
import ssl
import socketserver
import os
import socket

PORT = 8443

# Certs live in pwa-test/ at the repository root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CERT_DIR   = os.path.join(SCRIPT_DIR, '..', '..', 'pwa-test')
CERT_FILE  = os.path.join(CERT_DIR, 'cert.pem')
KEY_FILE   = os.path.join(CERT_DIR, 'key.pem')

if not os.path.exists(CERT_FILE):
    raise FileNotFoundError(
        f"cert.pem not found at {CERT_FILE}\n"
        "Run the cert generator in pwa-test/ first."
    )

# Try to show the LAN IP so you can type it on the iPad
try:
    lan_ip = socket.gethostbyname(socket.gethostname())
except Exception:
    lan_ip = 'YOUR_IP'

Handler = http.server.SimpleHTTPRequestHandler
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(CERT_FILE, KEY_FILE)

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    print(f'Serving HelpSeeker at  https://{lan_ip}:{PORT}')
    print('Press Ctrl-C to stop.')
    httpd.serve_forever()
