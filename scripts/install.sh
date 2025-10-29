#!/bin/bash
# Installation script for Linux/Mac

set -e

echo ""
echo "======================================================================"
echo "  🏰 Installation - Générateur de Devis LDR"
echo "======================================================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé"
    echo "   Visitez: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python détecté: $(python3 --version)"

# Check pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip n'est pas installé"
    exit 1
fi

echo "✅ pip détecté: $(pip3 --version)"
echo ""

# Install dependencies
echo "📦 Installation des dépendances..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dépendances installées avec succès"
else
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "🔑 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Configurez votre clé API Claude dans .env"
    echo ""
fi

echo ""
echo "======================================================================"
echo "  ✅ Installation terminée avec succès !"
echo "======================================================================"
echo ""
echo "🚀 Pour lancer l'application:"
echo "   python3 backend/server.py"
echo ""
echo "🌐 L'application sera accessible sur:"
echo "   http://localhost:5000"
echo ""
echo "📝 N'oubliez pas de configurer votre clé API dans .env"
echo ""
