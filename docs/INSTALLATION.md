# 🛠️ Guide d'Installation

## Prérequis

### Obligatoire
- **Python 3.8 ou supérieur** - [Télécharger Python](https://www.python.org/downloads/)
- **pip** (inclus avec Python)
- **Navigateur moderne** (Chrome, Firefox, Edge, Safari)

### Recommandé
- **Git** - [Télécharger Git](https://git-scm.com/downloads)
- **Environnement virtuel Python** (venv)

## Installation Rapide

### Méthode 1 : Scripts Automatiques

#### Windows
```cmd
scripts\install.bat
```

#### Linux/Mac
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

### Méthode 2 : Installation Manuelle

#### 1. Cloner le repository
```bash
git clone https://github.com/Albert-AI65/lesdomainesrares-quote-generator.git
cd lesdomainesrares-quote-generator
```

#### 2. Créer un environnement virtuel (recommandé)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

#### 4. Configurer les variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et ajouter votre clé API Claude
# CLAUDE_API_KEY=sk-ant-api03-votre-cle-ici
```

#### 5. Lancer l'application
```bash
python backend/server.py
```

L'application sera accessible sur **http://localhost:5000**

## Configuration

### Fichier .env

Créez un fichier `.env` à la racine du projet avec :

```env
# Flask Configuration
FLASK_APP=backend/server.py
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_SECRET_KEY=votre-cle-secrete-ici

# Server Configuration
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Claude AI Configuration
CLAUDE_API_KEY=sk-ant-api03-votre-cle-api-ici
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_MAX_TOKENS=1000

# CORS Configuration
CORS_ORIGINS=http://localhost:5000,http://127.0.0.1:5000
```

### Obtenir une clé API Claude

1. Créer un compte sur [console.anthropic.com](https://console.anthropic.com/)
2. Aller dans **API Keys**
3. Créer une nouvelle clé
4. Copier la clé dans votre fichier `.env`

## Vérification de l'installation

### Test de santé
```bash
curl http://localhost:5000/health
```

Réponse attendue :
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "config": {...}
}
```

### Test de génération IA
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"titre": "Test", "adresse": "Paris, France"}'
```

## Dépannage

### Erreur : "Python not found"
- Vérifiez que Python est installé : `python --version`
- Ajoutez Python au PATH Windows

### Erreur : "pip not found"
- Réinstallez Python avec pip inclus
- Ou installez pip : `python -m ensurepip --upgrade`

### Erreur : "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Erreur : "CLAUDE_API_KEY is not set"
- Vérifiez que le fichier `.env` existe
- Vérifiez que la clé API est correcte
- Redémarrez le serveur après modification du `.env`

## Installation pour le Développement

```bash
# Installer les dépendances de développement
pip install -r requirements-dev.txt

# Installer les outils frontend (optionnel)
npm install

# Lancer les tests
pytest tests/

# Linter
flake8 backend/
eslint frontend/js/
```

## Désinstallation

```bash
# Supprimer l'environnement virtuel
rm -rf venv/

# Supprimer le dossier du projet
cd ..
rm -rf lesdomainesrares-quote-generator/
```

## Mise à jour

```bash
# Récupérer les dernières modifications
git pull origin main

# Mettre à jour les dépendances
pip install -r requirements.txt --upgrade

# Redémarrer le serveur
python backend/server.py
```

## Support

En cas de problème :
- 📝 Consultez la [FAQ](USER_GUIDE.md#faq)
- 🐛 Signalez un bug sur [GitHub Issues](https://github.com/Albert-AI65/lesdomainesrares-quote-generator/issues)
- 📧 Contact : seminaires@lesdomainesrares.fr
