"""
ASTRA AI SOC Platform - Standalone Desktop Application Launcher
Manages React.js Frontend + Django REST Backend lifecycle and opens native app window.
"""
import os
import sys
import time
import socket
import subprocess
import urllib.request
import webbrowser

def get_base_dir():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def is_port_open(host, port, timeout=1.0):
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False

def is_url_ready(url, timeout=2.0):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "AstraLauncher/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return res.status in (200, 301, 302, 304)
    except Exception:
        return False

def ensure_services():
    base_dir = get_base_dir()
    creation_flags = 0x08000000 if sys.platform == 'win32' else 0 # CREATE_NO_WINDOW

    # 1. Check Django Backend (Port 8000)
    backend_ready = is_port_open("127.0.0.1", 8000) or is_url_ready("http://127.0.0.1:8000/api/v1/live-stream")
    if not backend_ready:
        django_dir = os.path.join(base_dir, "backend-django")
        manage_py = os.path.join(django_dir, "manage.py")
        if os.path.exists(manage_py):
            py_bin = "python"
            try:
                subprocess.Popen(
                    [py_bin, "manage.py", "runserver", "8000"],
                    cwd=django_dir,
                    creationflags=creation_flags,
                    shell=False
                )
            except Exception as e:
                print(f"[ASTRA] Warning starting Django: {e}")

    # 2. Check Frontend (Port 3000)
    frontend_ready = is_port_open("127.0.0.1", 3000) or is_url_ready("http://localhost:3000/")
    if not frontend_ready:
        pkg_json = os.path.join(base_dir, "package.json")
        if os.path.exists(pkg_json):
            try:
                subprocess.Popen(
                    "npm run dev",
                    cwd=base_dir,
                    creationflags=creation_flags,
                    shell=True
                )
            except Exception as e:
                print(f"[ASTRA] Warning starting Frontend: {e}")

    # 3. Wait up to 20 seconds for Frontend to be reachable
    for _ in range(20):
        if is_port_open("127.0.0.1", 3000) or is_url_ready("http://localhost:3000/"):
            break
        time.sleep(1)

def launch_astra_ai_desktop_app():
    ensure_services()

    target_url = "http://localhost:3000/"

    browser_paths = [
        # Microsoft Edge (Installed by default on modern Windows)
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        # Google Chrome
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        # Brave Browser
        r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
        r"C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
    ]

    launched = False
    for path in browser_paths:
        if os.path.exists(path):
            try:
                subprocess.Popen([
                    path,
                    f"--app={target_url}",
                    "--title=ASTRA AI - Autonomous SOC Platform"
                ])
                launched = True
                break
            except Exception:
                pass

    if not launched:
        try:
            webbrowser.open(target_url)
        except Exception:
            pass

if __name__ == "__main__":
    launch_astra_ai_desktop_app()
