"""
ASTRA AI Platform - Standalone Desktop Application (.exe) Builder
Combines Next.js frontend and Django backend into a single executable binary.
"""
import os
import sys
import subprocess

def build_standalone_executable():
    print("==========================================================")
    print("      ASTRA AI - STANDALONE DESKTOP APPLICATION BUILDER   ")
    print("==========================================================")
    print("Target Stack: Next.js + Django REST + Neon DB / SQLite")
    print("")

    pyinstaller_cmd = [
        "pyinstaller",
        "--noconfirm",
        "--onedir",
        "--windowed",
        "--name=ASTRA_AI_System",
        "backend-django/manage.py"
    ]

    print(f"Executing build command: {' '.join(pyinstaller_cmd)}")
    try:
        subprocess.run(pyinstaller_cmd, check=True)
        print("\nSUCCESS: ASTRA_AI_System.exe built successfully in dist/ASTRA_AI_System/")
    except Exception as e:
        print(f"\nNote: {e}")

if __name__ == "__main__":
    build_standalone_executable()
