# 🤝 Guide de Contribution

Merci de contribuer au Générateur de Devis LDR ! 🎉

## Code de Conduite

Soyez respectueux, constructif et bienveillant.

## Comment Contribuer ?

### 1. Signaler un Bug 🐛

Utilisez [GitHub Issues](https://github.com/Albert-AI65/lesdomainesrares-quote-generator/issues) avec le template "Bug Report" :

**Informations requises** :
- Description du bug
- Étapes pour reproduire
- Comportement attendu vs observé
- Captures d'écran
- Environnement (OS, Python version, Browser)

### 2. Proposer une Fonctionnalité ✨

Utilisez le template "Feature Request" :

**Informations requises** :
- Description de la fonctionnalité
- Cas d'usage
- Solutions alternatives envisagées
- Mockups/wireframes si possible

### 3. Soumettre du Code 💻

#### Workflow Git

```bash
# 1. Fork le repository
# 2. Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/lesdomainesrares-quote-generator.git

# 3. Créer une branche
git checkout -b feature/ma-super-fonctionnalite
# ou
git checkout -b fix/correction-bug

# 4. Faire vos modifications
# ...

# 5. Commit avec un message descriptif
git commit -m "feat: ajout d'export Excel"

# 6. Push vers votre fork
git push origin feature/ma-super-fonctionnalite

# 7. Créer une Pull Request
```

#### Conventions de Commit

Utilisez [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage (sans changement de code)
refactor: refactoring
test: ajout de tests
chore: maintenance
```

**Exemples** :
```bash
feat: add Excel export functionality
fix: resolve PDF generation error with special characters
docs: update installation guide for Windows
refactor: modularize PDF generator code
test: add unit tests for AI generator
```

## Standards de Code

### Python

**Style** : PEP 8

```bash
# Formatter
black backend/

# Linter
flake8 backend/

# Type checking
mypy backend/
```

**Exemple** :
```python
def generate_with_ai(titre: str, adresse: str) -> Dict[str, str]:
    """Generate commercial texts using Claude AI.
    
    Args:
        titre: Venue title
        adresse: Venue address
    
    Returns:
        Dict with texte_presentation and informations_acces
    
    Raises:
        AIGenerationError: If generation fails
    """
    # Implementation
    pass
```

### JavaScript

**Style** : ESLint + Prettier

```bash
# Linter
npm run lint

# Formatter
npm run format
```

**Exemple** :
```javascript
/**
 * Generate PDF document
 * @param {Object} data - Quote data
 * @returns {Promise<void>}
 */
async function generatePDF(data) {
  // Implementation
}
```

## Tests

### Tests Unitaires Python

```bash
# Exécuter tous les tests
pytest tests/

# Avec coverage
pytest --cov=backend tests/

# Un fichier spécifique
pytest tests/test_ai_generator.py
```

**Exemple de test** :
```python
import pytest
from backend.api.ai_generator import generate_with_ai, AIGenerationError

def test_generate_with_ai_success():
    result = generate_with_ai("Test", "Paris, France")
    assert 'texte_presentation' in result
    assert 'informations_acces' in result

def test_generate_with_ai_empty_titre():
    with pytest.raises(AIGenerationError):
        generate_with_ai("", "Paris")
```

### Tests Frontend

Utilisez Jest ou Vitest (en cours d'ajout).

## Structure du Projet

```
lesdomainesrares-quote-generator/
├── backend/           # Code Python Flask
│   ├── api/          # Endpoints API
│   └── utils/        # Utilitaires
├── frontend/          # Code frontend
│   ├── js/           # JavaScript modulaire
│   └── css/          # Styles
├── docs/              # Documentation
├── tests/             # Tests unitaires
└── scripts/           # Scripts d'installation
```

## Pull Request Checklist

Avant de soumettre une PR, vérifiez :

- [ ] Le code suit les standards
- [ ] Les tests passent (`pytest` + linters)
- [ ] La documentation est à jour
- [ ] Les commits suivent les conventions
- [ ] La PR a une description claire
- [ ] Les changements sont testés localement
- [ ] Pas de secrets/clés API dans le code

## Review Process

1. **Soumission** : Créez la PR avec description détaillée
2. **Review** : Un mainteneur review le code
3. **Modifications** : Apportez les corrections demandées
4. **Merge** : La PR est fusionnée une fois validée

## Priorités de Contribution

### 🔥 Haute Priorité
- Corrections de bugs critiques
- Problèmes de sécurité
- Amélioration des performances

### 👍 Moyenne Priorité
- Nouvelles fonctionnalités
- Amélioration de l'UX
- Documentation

### 👌 Basse Priorité
- Refactoring non urgent
- Optimisations mineures
- Ajout de commentaires

## Zones de Contribution

### Backend Python
- API endpoints
- Validation de données
- Intégration Claude AI
- Tests unitaires

### Frontend JavaScript
- Interface utilisateur
- Génération PDF
- Gestion des formulaires
- Stockage local

### Documentation
- Guides utilisateur
- Documentation API
- Tutoriels
- Traductions

### Tests
- Tests unitaires
- Tests d'intégration
- Tests E2E

## Questions ?

- 📝 [FAQ](USER_GUIDE.md#faq)
- 👬 [Discussions GitHub](https://github.com/Albert-AI65/lesdomainesrares-quote-generator/discussions)
- 📧 seminaires@lesdomainesrares.fr

## Remerciements

Merci à tous les contributeurs ! 🙏

Votre nom apparaîtra dans la liste des contributeurs.

---

**Happy Coding!** 🎉
