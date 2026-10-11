"""
ASTRA AI Platform - Standalone Desktop Application (.exe) Builder
Packages the ASTRA AI launcher into a standalone Windows .exe binary using PyInstaller.
"""
import os
import sys
import shutil
import subprocess

def build_standalone_executable():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    launcher_script = os.path.join(base_dir, "astra_app_launcher.py")

    print("==========================================================")
    print("      ASTRA AI - STANDALONE DESKTOP EXECUTABLE BUILDER    ")
    print("==========================================================")
    print(f"Base Directory: {base_dir}")
    print(f"Target Launcher: {launcher_script}")
    print("")

    pyinstaller_cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--clean",
        "--onefile",
        "--windowed",
        "--name=ASTRA_AI",
        f"--distpath={base_dir}",
        launcher_script
    ]

    print(f"Executing: {' '.join(pyinstaller_cmd)}")
    try:
        res = subprocess.run(pyinstaller_cmd, cwd=base_dir, check=True)
        exe_path = os.path.join(base_dir, "ASTRA_AI.exe")
        if os.path.exists(exe_path):
            size_mb = os.path.getsize(exe_path) / (1024 * 1024)
            print(f"\nSUCCESS: ASTRA_AI.exe updated successfully! ({size_mb:.2f} MB)")
            print(f"Binary Location: {exe_path}")
    except subprocess.CalledProcessError as e:
        print(f"\nBuild Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    build_standalone_executable()
