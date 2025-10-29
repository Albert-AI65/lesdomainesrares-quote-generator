# 🔌 Documentation API

## Base URL

```
http://localhost:5000
```

## Endpoints

### Health Check

**GET** `/health`

Vérifier l'état du serveur.

#### Réponse Succès (200)

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "config": {
    "debug": true,
    "host": "0.0.0.0",
    "port": 5000,
    "claude_model": "claude-sonnet-4-20250514",
    "cors_origins": ["http://localhost:5000"],
    "ratelimit_enabled": false
  }
}
```

---

### Générer avec l'IA

**POST** `/api/generate`

Générer des textes commerciaux avec Claude AI.

#### Requête

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "titre": "Domaine de Villiers",
  "adresse": "95470 Fosses, Val-d'Oise, France"
}
```

#### Réponse Succès (200)

```json
{
  "texte_presentation": "Cher client,\n\nNous sommes ravis de vous présenter le Domaine de Villiers...",
  "informations_acces": "Adresse : 95470 Fosses, Val-d'Oise, France\n\nSitué à 45 minutes de Paris..."
}
```

#### Réponse Erreur (400)

```json
{
  "error": "Titre is required"
}
```

#### Réponse Erreur (500)

```json
{
  "error": "API returned status 401: Unauthorized"
}
```

#### Exemple cURL

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Château de Versailles",
    "adresse": "Place d'Armes, 78000 Versailles"
  }'
```

#### Exemple JavaScript

```javascript
const response = await fetch('http://localhost:5000/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    titre: 'Château de Versailles',
    adresse: 'Place d\'Armes, 78000 Versailles'
  })
});

const data = await response.json();
console.log(data);
```

---

### Valider un Devis

**POST** `/api/validate-quote`

Valider la structure et les données d'un devis.

#### Requête

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "presentationTitle": "Domaine de Villiers",
  "prestationAddress": "95470 Fosses",
  "sendDate": "2025-01-15",
  "eventDate": "2025-02-20",
  "quoteObject": "Séminaire résidentiel",
  "clientCompany": "Entreprise XYZ",
  "clientContact": "Jean Dupont",
  "clientEmail": "jean.dupont@xyz.com",
  "clientPhone": "0123456789",
  "quoteLines": [
    {
      "description": "Location salle",
      "quantity": 1,
      "unitPrice": 5000,
      "tvaRate": 20,
      "isOption": false
    }
  ],
  "markup": 15
}
```

#### Réponse Succès (200)

```json
{
  "valid": true,
  "errors": [],
  "summary": {
    "quoteNumber": "DEVIS-2025-001",
    "clientCompany": "Entreprise XYZ",
    "eventDate": "2025-02-20",
    "totalHT": 5000.0,
    "totalHTWithMarkup": 5750.0,
    "totalTVA": 1150.0,
    "totalTTC": 6900.0,
    "lineCount": 1,
    "createdAt": "2025-01-15T10:30:00"
  }
}
```

#### Réponse Erreur (400)

```json
{
  "valid": false,
  "errors": [
    "Missing required field: clientEmail",
    "Quote line 1: quantity must be > 0"
  ]
}
```

---

## Codes d'État

| Code | Description |
|------|-------------|
| 200 | Succès |
| 400 | Requête invalide |
| 404 | Ressource introuvable |
| 500 | Erreur serveur |

## Gestion des Erreurs

Toutes les erreurs suivent ce format :

```json
{
  "error": "Message d'erreur descriptif"
}
```

## Rate Limiting

Actuellement désactivé en développement.

En production :
- **Limite** : 100 requêtes par heure par IP
- **Header de réponse** : `X-RateLimit-Remaining`

## CORS

Origines autorisées (configurable dans `.env`) :
- `http://localhost:5000`
- `http://127.0.0.1:5000`

## Authentification

Actuellement non implémentée. Prévue pour la version 3.0.

## Versions

### v2.0.0 (Actuelle)
- Génération IA avec Claude
- Validation de devis
- Health check

### v3.0.0 (Prévue)
- CRUD complet de devis
- Authentification utilisateur
- Export Excel
- Webhooks

## Support

Pour toute question sur l'API :
- 📝 [User Guide](USER_GUIDE.md)
- 🐛 [GitHub Issues](https://github.com/Albert-AI65/lesdomainesrares-quote-generator/issues)
- 📧 seminaires@lesdomainesrares.fr
