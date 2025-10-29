/**
 * Storage Module
 * Handles local storage with IndexedDB for quote persistence
 */

import { showNotification } from './utils.js';

const DB_NAME = 'LDRQuotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'quotes';

let db = null;

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
export async function initStorage() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Failed to open IndexedDB:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('✅ IndexedDB initialized');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                
                // Create indexes
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('clientName', 'data.nomClient', { unique: false });
                objectStore.createIndex('location', 'data.titre', { unique: false });
                
                console.log('📦 Object store created');
            }
        };
    });
}

/**
 * Save quote to IndexedDB
 * @param {object} quoteData - Quote data to save
 * @returns {Promise<number>} Quote ID
 */
export async function saveQuote(quoteData) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const quote = {
            timestamp: new Date().toISOString(),
            data: quoteData
        };
        
        const request = store.add(quote);
        
        request.onsuccess = () => {
            console.log('✅ Quote saved with ID:', request.result);
            showNotification('Devis sauvegardé avec succès', 'success');
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Failed to save quote:', request.error);
            showNotification('Erreur lors de la sauvegarde', 'error');
            reject(request.error);
        };
    });
}

/**
 * Load all quotes from IndexedDB
 * @returns {Promise<Array>} Array of quotes
 */
export async function loadAllQuotes() {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Failed to load quotes:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Load a specific quote by ID
 * @param {number} id - Quote ID
 * @returns {Promise<object>} Quote data
 */
export async function loadQuote(id) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        
        request.onsuccess = () => {
            if (request.result) {
                console.log('✅ Quote loaded:', id);
                resolve(request.result);
            } else {
                reject(new Error('Quote not found'));
            }
        };
        
        request.onerror = () => {
            console.error('Failed to load quote:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Delete a quote by ID
 * @param {number} id - Quote ID
 * @returns {Promise<void>}
 */
export async function deleteQuote(id) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        
        request.onsuccess = () => {
            console.log('✅ Quote deleted:', id);
            showNotification('Devis supprimé', 'success');
            resolve();
        };
        
        request.onerror = () => {
            console.error('Failed to delete quote:', request.error);
            showNotification('Erreur lors de la suppression', 'error');
            reject(request.error);
        };
    });
}

/**
 * Update existing quote
 * @param {number} id - Quote ID
 * @param {object} quoteData - Updated quote data
 * @returns {Promise<void>}
 */
export async function updateQuote(id, quoteData) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const quote = {
            id: id,
            timestamp: new Date().toISOString(),
            data: quoteData
        };
        
        const request = store.put(quote);
        
        request.onsuccess = () => {
            console.log('✅ Quote updated:', id);
            showNotification('Devis mis à jour', 'success');
            resolve();
        };
        
        request.onerror = () => {
            console.error('Failed to update quote:', request.error);
            showNotification('Erreur lors de la mise à jour', 'error');
            reject(request.error);
        };
    });
}

/**
 * Clear all quotes (with confirmation)
 * @returns {Promise<void>}
 */
export async function clearAllQuotes() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer tous les devis ?')) {
        return;
    }
    
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        
        request.onsuccess = () => {
            console.log('✅ All quotes cleared');
            showNotification('Tous les devis supprimés', 'success');
            resolve();
        };
        
        request.onerror = () => {
            console.error('Failed to clear quotes:', request.error);
            showNotification('Erreur lors de la suppression', 'error');
            reject(request.error);
        };
    });
}