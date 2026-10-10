import os
import sys
import time
import subprocess
import webbrowser

def launch_astra_ai_desktop_app():
    url = "http://localhost:3000/"
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    ]

    launched = False
    for path in edge_paths:
        if os.path.exists(path):
            try:
                subprocess.Popen([path, f"--app={url}", "--title=ASTRA AI Desktop Application"])
                launched = True
                break
            except Exception:
                pass

    if not launched:
        for path in chrome_paths:
            if os.path.exists(path):
                try:
                    subprocess.Popen([path, f"--app={url}"])
                    launched = True
                    break
                except Exception:
                    pass

    if not launched:
        webbrowser.open(url)

if __name__ == "__main__":
    launch_astra_ai_desktop_app()
