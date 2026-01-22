# 📁 Assets - Images & Métadonnées du Portfolio

## 📊 Structure des Fichiers

```
public/assets/
├── metadata.json          # Métadonnées complètes de toutes les images
└── img/                   # Dossier pour les images locales (à venir)
    ├── education/         # Logos des établissements d'enseignement
    ├── experience/        # Logos des entreprises
    └── certifications/    # Logos des fournisseurs de certifications
```

## 🎯 Contenu de metadata.json

Le fichier `metadata.json` contient **17 entrées d'images** organisées en 3 catégories :

### 📚 Éducation (3 images)
- **Université Côte d'Azur** - Master M2 Big Data (2024-2025)
- **EMSI Casablanca** - Ingénieur Informatique (2023-2025)
- **FST Mohammedia** - Licence Informatique & Réseaux (2020-2023)

### 💼 Expérience (5 images)
- **Capgemini** - Software Engineer (Mars 2025 - Présent)
- **Freelance** - Développeur Full Stack MERN (Juin 2024 - Présent)
- **OLA Energy** - Power BI & Power Apps Developer (Juil-Sep 2024)
- **SILIAD** - .NET & Angular Developer (Nov 2023 - Mai 2024)
- **ONP** - .NET Developer (Avr-Juin 2023)

### 🎓 Certifications (9 images)
1. SCRUM FOUNDATION PROFESSIONAL CERTIFICATION (SFPC)
2. Mockito: Next-Level Java Unit Testing
3. Learn Java Unit Testing with Junit & Mockito
4. Introduction to Big Data with Spark and Hadoop
5. Practical Java Unit Testing with JUnit 5
6. IBM Technical Certification
7. Google Cloud Training
8. Meta Professional Certificate
9. Certiprof SCRUM Certification

## 🚀 Utilisation dans le Portfolio

### JavaScript/TypeScript

```javascript
// Charger les métadonnées
const metadata = await fetch('/public/assets/metadata.json')
  .then(response => response.json());

// Récupérer toutes les images d'une catégorie
const educationImages = metadata.images.filter(
  img => img.category === 'education'
);

// Afficher un logo
educationImages.forEach(img => {
  console.log(`${img.institution}: ${img.url}`);
});

// Utiliser une image spécifique
const capgemini = metadata.images.find(
  img => img.company === 'Capgemini'
);

// Créer un élément img
const imgElement = document.createElement('img');
imgElement.src = capgemini.url;
imgElement.alt = capgemini.alt;
```

### React Example

```jsx
import metadata from './public/assets/metadata.json';

function EducationSection() {
  const eduImages = metadata.images.filter(
    img => img.category === 'education'
  );

  return (
    <div className="education">
      {eduImages.map(img => (
        <div key={img.id} className="institution">
          <img
            src={img.url}
            alt={img.alt}
            onError={(e) => {
              // Fallback si l'URL principale échoue
              e.target.src = img.fallback_url;
            }}
          />
          <h3>{img.institution}</h3>
          <p>{img.degree}</p>
          <span>{img.period}</span>
        </div>
      ))}
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div class="certifications">
    <div
      v-for="cert in certifications"
      :key="cert.id"
      class="cert-card"
    >
      <img :src="cert.url" :alt="cert.alt" />
      <h4>{{ cert.certification_name }}</h4>
      <p>{{ cert.provider }} - {{ cert.year }}</p>
    </div>
  </div>
</template>

<script>
import metadata from '@/public/assets/metadata.json';

export default {
  computed: {
    certifications() {
      return metadata.images.filter(
        img => img.category === 'certification'
      );
    }
  }
}
</script>
```

## 📋 Structure d'une Entrée

Chaque image dans `metadata.json` contient :

```json
{
  "id": "education_001",
  "category": "education",
  "institution": "Université Côte d'Azur",
  "alt": "Logo de Université Côte d'Azur",
  "type": "university",
  "degree": "Master M2 - Big Data & Systems Integration",
  "period": "2024-2025",
  "url": "https://www.univ-cotedazur.fr/...",
  "fallback_url": "https://media.licdn.com/..."
}
```

### Champs Communs
- `id` : Identifiant unique
- `category` : education | experience | certification
- `alt` : Texte alternatif pour l'accessibilité
- `type` : Type spécifique (university, company, tech_certification, etc.)
- `url` : URL principale de l'image
- `fallback_url` : URL de secours (optionnel)

### Champs Spécifiques par Catégorie

**Education:**
- `institution` : Nom de l'établissement
- `degree` : Diplôme obtenu
- `period` : Période d'études

**Experience:**
- `company` : Nom de l'entreprise
- `position` : Poste occupé
- `industry` : Secteur d'activité
- `location` : Localisation
- `period` : Période de travail

**Certification:**
- `provider` : Fournisseur de la certification
- `certification_name` : Nom complet de la certification
- `abbreviation` : Abréviation (optionnel)
- `year` : Année d'obtention

## 🔄 Mise à Jour

Pour ajouter une nouvelle image au metadata.json :

1. Ajoutez l'entrée dans le tableau `images`
2. Mettez à jour le compteur `total_images`
3. Mettez à jour le compteur de la catégorie dans `categories`
4. Mettez à jour `generated_at` avec la date actuelle

## 🎨 Intégration dans le Portfolio

Le fichier `portfolio.html` utilise déjà les URLs publiques pour :
- ✅ Logos des écoles dans la timeline académique
- ✅ Logos des certifications dans le slider
- ✅ Système de fallback intégré

## 📌 Notes Importantes

- Les URLs LinkedIn peuvent expirer → utilisez toujours un fallback
- Les logos sont en format PNG ou SVG
- Toutes les images sont optimisées pour le responsive
- Les métadonnées incluent les informations d'accessibilité (alt)

## 🔗 Liens Utiles

- Portfolio: `portfolio.html`
- CV: `cv.html`
- Métadonnées: `public/assets/metadata.json`

---

**Version:** 1.0.0
**Dernière mise à jour:** 8 octobre 2025
**Total d'images:** 17 (3 éducation + 5 expérience + 9 certifications)
