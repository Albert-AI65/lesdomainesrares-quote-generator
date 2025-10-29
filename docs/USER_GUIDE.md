# 📚 Guide Utilisateur

## Premiers Pas

### Lancement de l'Application

#### Windows
```cmd
scripts\run.bat
```

#### Linux/Mac
```bash
./scripts/run.sh
```

Ou directement :
```bash
python backend/server.py
```

Ouvrez ensuite votre navigateur sur **http://localhost:5000**

## Créer un Devis

### Étape 1 : Présentation Commerciale

#### Génération Automatique avec l'IA ✨

1. **Remplir les champs requis** :
   - Titre de la présentation
   - Adresse de la prestation

2. **Cliquer sur "✨ Générer la présentation avec l'IA"**

3. **Attendre 3-5 secondes**

4. **Les textes sont insérés automatiquement** :
   - Texte de présentation commerciale
   - Informations d'accès et transport

5. **Modifier si nécessaire**

#### Génération Manuelle

Vous pouvez aussi saisir directement vos textes sans utiliser l'IA.

#### Ajouter des Photos

1. Cliquer sur la zone "Cliquez pour ajouter des photos"
2. Sélectionner 2-3 photos (recommandé)
3. Les photos s'affichent en prévisualisation
4. Cliquer sur une photo pour la supprimer

### Étape 2 : Informations du Devis

**Champs obligatoires** :
- Date d'envoi (pré-remplie avec la date du jour)
- Date de l'événement
- Type de prestation (séminaire, soirée, autre)
- Type de devis (transport, lieu, animation, autre)
- Objet du devis

### Étape 3 : Informations Client

**Champs obligatoires** :
- Société
- Contact (Nom Prénom)
- Email
- Téléphone

**Formatage automatique** :
- Les noms sont automatiquement capitalisés
- Les emails sont convertis en minuscules
- Les téléphones sont formatés en "01 23 45 67 89"

### Étape 4 : Lignes du Devis

#### Ajouter une Ligne

1. Cliquer sur "+ Ajouter une ligne"
2. Remplir :
   - **Description de la prestation**
   - **Quantité**
   - **Prix unitaire HT**
   - **Taux de TVA** (10% ou 20%)
   - **Option** (cocher si ligne optionnelle)

#### Majoration Transparente

Utilisez le curseur pour appliquer une majoration globale (0-100%).

La majoration est répartie proportionnellement sur toutes les lignes.

#### Calculs Automatiques

Le système calcule automatiquement :
- Total HT (avant majoration)
- Total HT (après majoration)
- Total TVA
- Total TTC
- Acompte à la signature (80%)
- Solde à J-7 (20%)

### Étape 5 : Conditions Générales

Personnalisez les CGV selon vos besoins.

### Étape 6 : Générer le PDF

1. Cliquer sur "📄 Générer le PDF"
2. Le formulaire est validé automatiquement
3. Le PDF est téléchargé (DEVIS-2025-XXX.pdf)

## Fonctionnalités Avancées

### Sauvegarder un Devis

**Sauvegarde automatique** : Toutes les 30 secondes

**Sauvegarde manuelle** :
1. Cliquer sur "💾 Sauvegarder"
2. Le devis est enregistré localement

### Charger un Devis

1. Cliquer sur "📂 Charger un devis"
2. Sélectionner dans l'historique
3. Le formulaire se remplit automatiquement

### Dupliquer un Devis

1. Charger un devis existant
2. Modifier les informations nécessaires
3. Générer un nouveau PDF

### Créer un Template

1. Créer un devis type
2. Sauvegarder
3. Renommer en "TEMPLATE - Nom du template"
4. Réutiliser pour les devis similaires

### Bibliothèque de Lieux

Créez une bibliothèque de textes générés :

1. Générer avec l'IA pour chaque nouveau lieu
2. Copier les textes dans un document Word/Google Docs
3. Réutiliser pour éviter les coûts IA

## Astuces & Conseils

### 💡 Optimiser l'IA

- **Soyez précis** : Plus l'adresse est complète, meilleurs sont les textes
- **Vérifiez toujours** : L'IA peut faire des erreurs, relisez les textes
- **Créez une bibliothèque** : Économisez en réutilisant les textes

### 💰 Réduire les Coûts

- Utilisez l'IA uniquement pour les nouveaux lieux
- Copiez-collez les textes existants pour les lieux récurrents
- Créez des templates pour les types d'événements fréquents

### ⚡ Accélérer la Saisie

- Utilisez la touche **Tab** pour naviguer entre les champs
- Le formatage est automatique (pas besoin de formater manuellement)
- Les calculs se mettent à jour en temps réel

### 📸 Photos de Qualité

- Format recommandé : JPEG ou PNG
- Taille recommandée : 1920x1080px
- Poids maximum : 5 MB par photo
- Nombre idéal : 2-3 photos

## Raccourcis Clavier

- **Ctrl + S** : Sauvegarder le devis
- **Ctrl + N** : Nouveau devis
- **Ctrl + O** : Charger un devis
- **Ctrl + P** : Générer le PDF

## FAQ

### Q : Puis-je utiliser l'application sans connexion Internet ?
**R** : Le backend Flask fonctionne hors ligne, mais l'IA nécessite une connexion. Utilisez la saisie manuelle pour travailler hors ligne.

### Q : Combien coûte l'utilisation de l'IA ?
**R** : Environ 0.01-0.02€ par génération. Pour 20 devis/jour, comptez ~6€/mois.

### Q : Les données sont-elles sécurisées ?
**R** : Oui, toutes les données sont stockées localement sur votre ordinateur. Seuls le titre et l'adresse sont envoyés à Claude IA pour génération.

### Q : Puis-je personnaliser le logo ?
**R** : Oui, remplacez le fichier `frontend/assets/logo.svg` par votre logo.

### Q : Comment exporter vers Excel ?
**R** : Fonctionnalité en développement. Pour l'instant, copiez-collez les données depuis le PDF.

### Q : L'IA génère des textes incorrects, que faire ?
**R** : Relancez la génération ou modifiez manuellement. L'IA n'est pas parfaite.

### Q : Puis-je utiliser sur plusieurs ordinateurs ?
**R** : Oui, installez l'application sur chaque ordinateur. Les données sont locales.

## Support

- 📝 [Guide d'installation](INSTALLATION.md)
- 🐛 [Signaler un bug](https://github.com/Albert-AI65/lesdomainesrares-quote-generator/issues)
- 📧 Email : seminaires@lesdomainesrares.fr
- 📞 Téléphone : 01 86 98 34 87
