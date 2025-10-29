/**
 * Form Handler Module
 * Manages form interactions, validation, and data collection
 */

import { generateAITexts } from './api-client.js';
import { saveQuote, loadAllQuotes } from './storage.js';
import { showNotification, formatPrice, validateEmail, sanitizeInput } from './utils.js';
import { markFormClean, markFormDirty } from './main.js';

let prestationsCount = 0;

/**
 * Initialize form handlers
 */
export function initFormHandlers() {
    // AI Generation button
    const btnGenerateAI = document.getElementById('btn-generate-ai');
    if (btnGenerateAI) {
        btnGenerateAI.addEventListener('click', handleAIGeneration);
    }
    
    // Prestation management
    const btnAddPrestation = document.getElementById('btn-add-prestation');
    if (btnAddPrestation) {
        btnAddPrestation.addEventListener('click', addPrestation);
    }
    
    // Add initial prestation
    addPrestation();
    
    // Action buttons
    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
        btnSave.addEventListener('click', handleSave);
    }
    
    const btnLoad = document.getElementById('btn-load');
    if (btnLoad) {
        btnLoad.addEventListener('click', handleLoad);
    }
    
    const btnNew = document.getElementById('btn-new');
    if (btnNew) {
        btnNew.addEventListener('click', handleNew);
    }
    
    // Auto-format inputs
    setupInputFormatting();
    
    console.log('✅ Form handlers initialized');
}

/**
 * Handle AI generation
 */
async function handleAIGeneration() {
    const titre = document.getElementById('titre').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    
    if (!titre || !adresse) {
        showNotification('Veuillez renseigner le titre et l\'adresse', 'warning');
        return;
    }
    
    const btn = document.getElementById('btn-generate-ai');
    const loading = document.getElementById('ai-loading');
    
    try {
        // Disable button and show loading
        btn.disabled = true;
        loading.style.display = 'block';
        
        // Call API
        const result = await generateAITexts(titre, adresse);
        
        // Fill in the generated texts
        document.getElementById('texte-presentation').value = result.texte_presentation || '';
        document.getElementById('informations-acces').value = result.informations_acces || '';
        
        showNotification('Textes générés avec succès !', 'success');
        markFormDirty();
        
    } catch (error) {
        console.error('AI generation error:', error);
        showNotification('Erreur lors de la génération: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        loading.style.display = 'none';
    }
}

/**
 * Add a new prestation line
 */
function addPrestation() {
    const container = document.getElementById('prestations-container');
    const template = document.getElementById('prestation-template');
    
    if (!container || !template) return;
    
    // Clone template
    const clone = template.content.cloneNode(true);
    
    // Set prestation number
    prestationsCount++;
    const numberSpan = clone.querySelector('.prestation-number');
    if (numberSpan) {
        numberSpan.textContent = `Prestation ${prestationsCount}`;
    }
    
    // Add event listeners
    const prestationItem = clone.querySelector('.prestation-item');
    
    // Remove button
    const removeBtn = clone.querySelector('.btn-remove-prestation');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            prestationItem.remove();
            updateTotals();
            markFormDirty();
        });
    }
    
    // Auto-calculate on input
    const quantiteInput = clone.querySelector('.prestation-quantite');
    const prixInput = clone.querySelector('.prestation-prix');
    const totalInput = clone.querySelector('.prestation-total');
    
    const calculateTotal = () => {
        const quantite = parseFloat(quantiteInput.value) || 0;
        const prix = parseFloat(prixInput.value) || 0;
        const total = quantite * prix;
        totalInput.value = formatPrice(total);
        updateTotals();
        markFormDirty();
    };
    
    quantiteInput.addEventListener('input', calculateTotal);
    prixInput.addEventListener('input', calculateTotal);
    
    container.appendChild(clone);
    updateTotals();
}

/**
 * Update all totals
 */
function updateTotals() {
    const prestations = document.querySelectorAll('.prestation-item');
    let totalHT = 0;
    
    prestations.forEach(prestation => {
        const quantite = parseFloat(prestation.querySelector('.prestation-quantite').value) || 0;
        const prix = parseFloat(prestation.querySelector('.prestation-prix').value) || 0;
        totalHT += quantite * prix;
    });
    
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;
    
    document.getElementById('total-ht').textContent = formatPrice(totalHT);
    document.getElementById('total-tva').textContent = formatPrice(tva);
    document.getElementById('total-ttc').textContent = formatPrice(totalTTC);
}

/**
 * Collect all form data
 */
export function collectFormData() {
    const prestations = [];
    document.querySelectorAll('.prestation-item').forEach(item => {
        prestations.push({
            description: sanitizeInput(item.querySelector('.prestation-description').value),
            quantite: parseFloat(item.querySelector('.prestation-quantite').value) || 0,
            prixUnitaire: parseFloat(item.querySelector('.prestation-prix').value) || 0
        });
    });
    
    return {
        titre: sanitizeInput(document.getElementById('titre').value),
        adresse: sanitizeInput(document.getElementById('adresse').value),
        textePresentation: sanitizeInput(document.getElementById('texte-presentation').value),
        informationsAcces: sanitizeInput(document.getElementById('informations-acces').value),
        nomClient: sanitizeInput(document.getElementById('nom-client').value),
        emailClient: sanitizeInput(document.getElementById('email-client').value),
        telephoneClient: sanitizeInput(document.getElementById('telephone-client').value),
        entrepriseClient: sanitizeInput(document.getElementById('entreprise-client').value),
        dateEvenement: document.getElementById('date-evenement').value,
        nbPersonnes: parseInt(document.getElementById('nb-personnes').value) || 0,
        typeEvenement: document.getElementById('type-evenement').value,
        prestations: prestations,
        notes: sanitizeInput(document.getElementById('notes').value),
        timestamp: new Date().toISOString()
    };
}

/**
 * Fill form with data
 */
export function fillFormData(data) {
    document.getElementById('titre').value = data.titre || '';
    document.getElementById('adresse').value = data.adresse || '';
    document.getElementById('texte-presentation').value = data.textePresentation || '';
    document.getElementById('informations-acces').value = data.informationsAcces || '';
    document.getElementById('nom-client').value = data.nomClient || '';
    document.getElementById('email-client').value = data.emailClient || '';
    document.getElementById('telephone-client').value = data.telephoneClient || '';
    document.getElementById('entreprise-client').value = data.entrepriseClient || '';
    document.getElementById('date-evenement').value = data.dateEvenement || '';
    document.getElementById('nb-personnes').value = data.nbPersonnes || '';
    document.getElementById('type-evenement').value = data.typeEvenement || '';
    document.getElementById('notes').value = data.notes || '';
    
    // Clear and add prestations
    document.getElementById('prestations-container').innerHTML = '';
    prestationsCount = 0;
    
    if (data.prestations && data.prestations.length > 0) {
        data.prestations.forEach(prestation => {
            addPrestation();
            const items = document.querySelectorAll('.prestation-item');
            const lastItem = items[items.length - 1];
            lastItem.querySelector('.prestation-description').value = prestation.description || '';
            lastItem.querySelector('.prestation-quantite').value = prestation.quantite || 1;
            lastItem.querySelector('.prestation-prix').value = prestation.prixUnitaire || 0;
            lastItem.querySelector('.prestation-quantite').dispatchEvent(new Event('input'));
        });
    } else {
        addPrestation();
    }
    
    markFormClean();
}

/**
 * Handle save
 */
async function handleSave() {
    const data = collectFormData();
    
    // Validate
    if (!data.nomClient || !data.titre) {
        showNotification('Le nom du client et le titre sont requis', 'warning');
        return;
    }
    
    if (data.emailClient && !validateEmail(data.emailClient)) {
        showNotification('Email invalide', 'warning');
        return;
    }
    
    try {
        await saveQuote(data);
        markFormClean();
    } catch (error) {
        console.error('Save error:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

/**
 * Handle load
 */
async function handleLoad() {
    try {
        const quotes = await loadAllQuotes();
        
        if (quotes.length === 0) {
            showNotification('Aucun devis sauvegardé', 'info');
            return;
        }
        
        // Create modal to select quote
        const modal = createLoadModal(quotes);
        document.body.appendChild(modal);
        
    } catch (error) {
        console.error('Load error:', error);
        showNotification('Erreur lors du chargement', 'error');
    }
}

/**
 * Create load modal
 */
function createLoadModal(quotes) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background: white; padding: 2rem; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto;';
    
    const title = document.createElement('h2');
    title.textContent = 'Charger un devis';
    content.appendChild(title);
    
    const list = document.createElement('div');
    quotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(quote => {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 1rem; margin: 0.5rem 0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;';
        item.innerHTML = `
            <strong>${quote.data.nomClient || 'Sans nom'}</strong><br>
            <small>${quote.data.titre || 'Sans titre'} - ${new Date(quote.timestamp).toLocaleDateString()}</small>
        `;
        item.onclick = () => {
            fillFormData(quote.data);
            modal.remove();
            showNotification('Devis chargé', 'success');
        };
        list.appendChild(item);
    });
    content.appendChild(list);
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fermer';
    closeBtn.className = 'btn btn-secondary';
    closeBtn.style.marginTop = '1rem';
    closeBtn.onclick = () => modal.remove();
    content.appendChild(closeBtn);
    
    modal.appendChild(content);
    return modal;
}

/**
 * Handle new quote
 */
function handleNew() {
    if (confirm('Créer un nouveau devis ? Les modifications non sauvegardées seront perdues.')) {
        document.querySelectorAll('input, textarea, select').forEach(el => el.value = '');
        document.getElementById('prestations-container').innerHTML = '';
        prestationsCount = 0;
        addPrestation();
        updateTotals();
        markFormClean();
        showNotification('Nouveau devis créé', 'success');
    }
}

/**
 * Setup input formatting
 */
function setupInputFormatting() {
    // Auto-format phone numbers
    const phoneInput = document.getElementById('telephone-client');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,2}/g).join(' ');
            }
            e.target.value = value;
        });
    }
}