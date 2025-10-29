# 🏰 Générateur de Devis LDR - Les Domaines Rares

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-3.0+-green.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> Générateur de devis professionnel avec intelligence artificielle pour l'organisation d'événements d'entreprise dans des châteaux et domaines d'exception.

## ✨ Fonctionnalités

### 🤖 Intelligence Artificielle
- **Génération automatique de textes commerciaux** avec Claude AI
- Descriptions de lieux personnalisées
- Informations d'accès et transport optimisées
- Gain de temps : **10-15 minutes → 3-5 minutes par devis**

### 📄 Génération PDF Professionnelle
- Templates multi-pages (présentation, détails, CGV)
- Calculs automatiques (TVA, acomptes, majorations)
- Support d'images haute qualité
- Logo et branding personnalisables
- Tableaux formatés avec jsPDF-AutoTable

### 💾 Gestion des Données
- **Sauvegarde/Chargement de devis**
- Historique complet des devis générés
- Export/Import de templates
- Bibliothèque de lieux préenregistrés
- Stockage local sécurisé (IndexedDB)

### 🎨 Interface Moderne
- Design responsive et professionnel
- Validation en temps réel
- Prévisualisation avant génération
- Mode sombre disponible
- Notifications intelligentes

## 🚀 Installation Rapide

### Prérequis
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)
- Navigateur moderne (Chrome, Firefox, Edge)

### Installation en 3 étapes

#### 1. Cloner le repository
```bash
git clone https://github.com/Albert-AI65/lesdomainesrares-quote-generator.git
cd lesdomainesrares-quote-generator
```

#### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

#### 3. Lancer l'application
```bash
python backend/server.py
```

L'application sera accessible sur **http://localhost:5000**

### Installation Automatique

**Windows:**
```cmd
scripts\install.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

## 📖 Utilisation

### Créer un devis avec l'IA

1. **Remplir les informations de base**
   - Titre de la prestation
   - Adresse du lieu
   - Date de l'événement

2. **Générer avec l'IA** ✨
   - Cliquer sur "Générer la présentation avec l'IA"
   - Attendre 3-5 secondes
   - Les textes sont insérés automatiquement

3. **Compléter le devis**
   - Ajouter les prestations et tarifs
   - Uploader des photos (2-3 recommandées)
   - Ajuster les conditions générales

4. **Générer le PDF**
   - Valider le formulaire
   - Télécharger le PDF professionnel

## 🏗️ Architecture

### Stack Technique

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Backend**: Flask (Python)
- **IA**: Claude AI (Anthropic)
- **Stockage**: IndexedDB (local)

## 📊 Performance

- **Temps de chargement**: < 2 secondes
- **Génération PDF**: < 1 seconde (devis standard)
- **Génération IA**: 3-5 secondes
- **Taille bundle**: ~500 KB (compressé)

## 💰 Coûts

### Utilisation de l'IA
- ~0.01-0.02€ par génération de texte
- 20 devis/jour ≈ 6€/mois
- 50 devis/jour ≈ 15€/mois

### Astuce Économie
💡 Créez une bibliothèque de textes générés pour les lieux récurrents

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## 📝 License

MIT License - voir [LICENSE](LICENSE)

## 📞 Support

- **Email**: seminaires@lesdomainesrares.fr
- **Téléphone**: 01 86 98 34 87
- **Adresse**: 48 RUE RAPATEL, 93100 MONTREUIL

## 🎯 Roadmap

### Version 2.0 (En cours)
- [x] Génération IA
- [x] Sauvegarde/Chargement
- [x] jsPDF-AutoTable
- [ ] Mode hors ligne complet
- [ ] Export Excel
- [ ] Multi-langues

### Version 3.0 (Prévue)
- [ ] Base de données PostgreSQL
- [ ] Multi-utilisateurs
- [ ] API RESTful complète
- [ ] Application mobile (PWA)
- [ ] Intégration comptabilité

## ⭐ Remerciements

- [Flask](https://flask.palletsprojects.com/) - Framework web
- [jsPDF](https://github.com/parallax/jsPDF) - Génération PDF
- [Claude AI](https://www.anthropic.com/) - Intelligence artificielle
- [Font Awesome](https://fontawesome.com/) - Icônes

---

<p align="center">
  Développé avec ❤️ pour Les Domaines Rares
</p>

<p align="center">
  <a href="https://github.com/Albert-AI65/lesdomainesrares-quote-generator/stargazers">⭐ Star ce projet</a>
</p>
