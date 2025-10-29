#!/bin/bash
# Run script for Linux/Mac

set -e

echo ""
echo "🚀 Lancement du Générateur de Devis LDR..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant"
    echo "   Exécutez: ./scripts/install.sh"
    exit 1
fi

# Run server
python3 backend/server.py
