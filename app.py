import os
import webbrowser
from threading import Timer
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000')

if __name__ == '__main__':
    print("=" * 60)
    print(" ✨ Starting Play_time - The PAAPS Bunk Experience! ✨ ")
    print(" Opening browser at: http://127.0.0.1:5000 ")
    print("=" * 60)
    Timer(1.0, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)
