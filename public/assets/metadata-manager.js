/**
 * Portfolio Metadata Manager
 * Gère le chargement et l'utilisation des métadonnées d'images
 */

class PortfolioMetadata {
    constructor() {
        this.metadata = null;
        this.loaded = false;
    }

    /**
     * Charge les métadonnées depuis le fichier JSON
     */
    async load() {
        if (this.loaded) return this.metadata;

        try {
            const response = await fetch('/public/assets/metadata.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.metadata = await response.json();
            this.loaded = true;
            console.log(`✅ Métadonnées chargées: ${this.metadata.total_images} images`);
            return this.metadata;
        } catch (error) {
            console.error('❌ Erreur lors du chargement des métadonnées:', error);
            throw error;
        }
    }

    /**
     * Récupère toutes les images d'une catégorie
     * @param {string} category - education, experience ou certification
     */
    getByCategory(category) {
        if (!this.loaded) {
            throw new Error('Métadonnées non chargées. Appelez load() d\'abord.');
        }
        return this.metadata.images.filter(img => img.category === category);
    }

    /**
     * Récupère une image par son ID
     * @param {string} id - L'ID unique de l'image
     */
    getById(id) {
        if (!this.loaded) {
            throw new Error('Métadonnées non chargées. Appelez load() d\'abord.');
        }
        return this.metadata.images.find(img => img.id === id);
    }

    /**
     * Récupère les images par le nom de l'institution/entreprise/fournisseur
     * @param {string} name - Le nom à rechercher
     */
    getByName(name) {
        if (!this.loaded) {
            throw new Error('Métadonnées non chargées. Appelez load() d\'abord.');
        }
        return this.metadata.images.filter(img =>
            (img.institution && img.institution.toLowerCase().includes(name.toLowerCase())) ||
            (img.company && img.company.toLowerCase().includes(name.toLowerCase())) ||
            (img.provider && img.provider.toLowerCase().includes(name.toLowerCase()))
        );
    }

    /**
     * Crée un élément img avec fallback automatique
     * @param {Object} imageData - Les données de l'image depuis metadata
     * @param {Object} options - Options supplémentaires (classes, styles, etc.)
     */
    createImageElement(imageData, options = {}) {
        const img = document.createElement('img');
        img.src = imageData.url;
        img.alt = imageData.alt;

        // Ajouter le fallback
        if (imageData.fallback_url) {
            img.onerror = function() {
                console.warn(`⚠️ Échec du chargement de ${imageData.url}, utilisation du fallback`);
                this.src = imageData.fallback_url;
                // Retirer l'event listener après le premier échec
                this.onerror = null;
            };
        }

        // Ajouter les classes CSS
        if (options.classes) {
            img.className = Array.isArray(options.classes)
                ? options.classes.join(' ')
                : options.classes;
        }

        // Ajouter les attributs personnalisés
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                img.setAttribute(key, value);
            });
        }

        // Ajouter les styles inline
        if (options.styles) {
            Object.assign(img.style, options.styles);
        }

        return img;
    }

    /**
     * Génère le HTML pour une section d'éducation
     */
    generateEducationHTML() {
        const education = this.getByCategory('education');
        return education.map(edu => `
            <div class="timeline-item" data-id="${edu.id}">
                <div class="timeline-marker">
                    <div class="school-logo">
                        <img src="${edu.url}"
                             alt="${edu.alt}"
                             class="logo-img"
                             onerror="this.src='${edu.fallback_url}'">
                    </div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-date">${edu.period}</div>
                    <h4>${edu.degree}</h4>
                    <p class="institution">${edu.institution}</p>
                </div>
            </div>
        `).join('');
    }

    /**
     * Génère le HTML pour les certifications
     */
    generateCertificationsHTML() {
        const certifications = this.getByCategory('certification');
        return certifications.map(cert => `
            <div class="certification-slide" data-id="${cert.id}">
                <div class="certification-card">
                    <div class="cert-logo">
                        <img src="${cert.url}"
                             alt="${cert.alt}"
                             class="cert-logo-img"
                             onerror="this.src='${cert.fallback_url || ''}'">
                    </div>
                    <div class="cert-content">
                        <h4>${cert.certification_name}</h4>
                        <p class="cert-provider">${cert.provider}</p>
                        <span class="cert-date">${cert.year}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Génère le HTML pour l'expérience
     */
    generateExperienceHTML() {
        const experiences = this.getByCategory('experience');
        return experiences.map(exp => `
            <div class="experience-item" data-id="${exp.id}">
                <div class="company-logo">
                    <img src="${exp.url}"
                         alt="${exp.alt}"
                         onerror="this.src='${exp.fallback_url || ''}'">
                </div>
                <div class="experience-content">
                    <h3>${exp.position}</h3>
                    <p class="company-name">${exp.company}</p>
                    <p class="period">${exp.period}</p>
                    <p class="location">${exp.location || ''}</p>
                </div>
            </div>
        `).join('');
    }

    /**
     * Obtient les statistiques des métadonnées
     */
    getStats() {
        if (!this.loaded) {
            throw new Error('Métadonnées non chargées. Appelez load() d\'abord.');
        }

        return {
            total: this.metadata.total_images,
            categories: this.metadata.categories,
            byCategory: {
                education: this.getByCategory('education').length,
                experience: this.getByCategory('experience').length,
                certification: this.getByCategory('certification').length
            },
            generatedAt: this.metadata.generated_at,
            version: this.metadata.version
        };
    }

    /**
     * Recherche dans toutes les métadonnées
     * @param {string} query - Terme de recherche
     */
    search(query) {
        if (!this.loaded) {
            throw new Error('Métadonnées non chargées. Appelez load() d\'abord.');
        }

        const searchTerm = query.toLowerCase();
        return this.metadata.images.filter(img => {
            const searchableFields = [
                img.institution,
                img.company,
                img.provider,
                img.certification_name,
                img.degree,
                img.position,
                img.alt
            ].filter(Boolean).map(field => field.toLowerCase());

            return searchableFields.some(field => field.includes(searchTerm));
        });
    }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioMetadata;
}

// Instance globale pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
    window.PortfolioMetadata = PortfolioMetadata;
}

// Exemple d'utilisation
/*
// Initialisation
const metadata = new PortfolioMetadata();
await metadata.load();

// Récupérer les certifications
const certifications = metadata.getByCategory('certification');
console.log('Certifications:', certifications);

// Rechercher une institution
const emsi = metadata.getByName('EMSI');
console.log('EMSI:', emsi);

// Créer un élément image avec fallback
const capgemini = metadata.getById('experience_001');
const imgElement = metadata.createImageElement(capgemini, {
    classes: ['company-logo', 'rounded'],
    attributes: { width: '100', height: '100' }
});
document.querySelector('#logos-container').appendChild(imgElement);

// Générer HTML pour les certifications
const certHTML = metadata.generateCertificationsHTML();
document.querySelector('#certifications').innerHTML = certHTML;

// Obtenir les statistiques
const stats = metadata.getStats();
console.log('Statistiques:', stats);
*/
