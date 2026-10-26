#!/usr/bin/env python
"""
FINVERSE AI — Quick start script
Starts the Django dev server on port 8000
"""
import subprocess, sys, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run([sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'])
