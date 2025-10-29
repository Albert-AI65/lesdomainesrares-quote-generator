@echo off
REM Run script for Windows

echo.
echo 🚀 Lancement du Générateur de Devis LDR...
echo.

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Fichier .env manquant
    echo    Exécutez: scripts\install.bat
    pause
    exit /b 1
)

REM Run server
python backend\server.py
pause
