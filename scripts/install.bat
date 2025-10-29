@echo off
REM Installation script for Windows

echo.
echo ======================================================================
echo   🏰 Installation - Générateur de Devis LDR
echo ======================================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé
    echo    Visitez: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python détecté
python --version

REM Check pip
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip n'est pas installé
    pause
    exit /b 1
)

echo ✅ pip détecté
pip --version
echo.

REM Install dependencies
echo 📦 Installation des dépendances...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo ✅ Dépendances installées avec succès
echo.

REM Create .env if not exists
if not exist ".env" (
    echo 🔑 Création du fichier .env...
    copy .env.example .env
    echo ⚠️  IMPORTANT: Configurez votre clé API Claude dans .env
    echo.
)

echo.
echo ======================================================================
echo   ✅ Installation terminée avec succès !
echo ======================================================================
echo.
echo 🚀 Pour lancer l'application:
echo    python backend\server.py
echo.
echo 🌐 L'application sera accessible sur:
echo    http://localhost:5000
echo.
echo 📝 N'oubliez pas de configurer votre clé API dans .env
echo.
pause
