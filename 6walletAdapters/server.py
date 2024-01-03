import os
import http.server
import socketserver

PORT = 8123
WEBDIR = os.path.join(os.path.dirname(__file__), "dist")


class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        path = path.split("?", 1)[0]
        path = path.split("#", 1)[0]
        path = os.path.normpath(path)
        words = path.split("/")
        words = filter(None, words)
        path = WEBDIR
        for word in words:
            drive, word = os.path.splitdrive(word)
            head, word = os.path.split(word)
            if word in (os.curdir, os.pardir):
                continue
            path = os.path.join(path, word)
        if path == WEBDIR:
            return os.path.join(path, "index.html")
        return path


with socketserver.TCPServer(("", PORT), RequestHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
