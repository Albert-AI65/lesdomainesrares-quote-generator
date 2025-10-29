/**
 * Main Application Entry Point
 * Initializes all modules and sets up event handlers
 */

import { initFormHandlers } from './form-handler.js';
import { initPDFGenerator } from './pdf-generator.js';
import { initStorage } from './storage.js';
import { showNotification } from './utils.js';

/**
 * Application state
 */
const appState = {
    initialized: false,
    currentQuote: null,
    isDirty: false
};

/**
 * Initialize the application
 */
async function initApp() {
    try {
        console.log('🚀 Initializing LDR Quote Generator...');
        
        // Initialize storage
        await initStorage();
        console.log('✅ Storage initialized');
        
        // Initialize form handlers
        initFormHandlers();
        console.log('✅ Form handlers initialized');
        
        // Initialize PDF generator
        initPDFGenerator();
        console.log('✅ PDF generator initialized');
        
        // Set up global event listeners
        setupGlobalListeners();
        
        // Mark as initialized
        appState.initialized = true;
        
        console.log('✅ Application ready!');
        showNotification('Application prête à l\'utilisation', 'success', 2000);
        
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        showNotification('Erreur lors de l\'initialisation de l\'application', 'error');
    }
}

/**
 * Set up global event listeners
 */
function setupGlobalListeners() {
    // Prevent accidental page reload when form is dirty
    window.addEventListener('beforeunload', (e) => {
        if (appState.isDirty) {
            e.preventDefault();
            e.returnValue = 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?';
            return e.returnValue;
        }
    });
    
    // Track form changes
    document.addEventListener('input', () => {
        appState.isDirty = true;
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const saveBtn = document.getElementById('btn-save');
            if (saveBtn) saveBtn.click();
        }
        
        // Ctrl/Cmd + P to export PDF
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            const exportBtn = document.getElementById('btn-export-pdf');
            if (exportBtn) exportBtn.click();
        }
    });
}

/**
 * Mark form as clean (saved)
 */
export function markFormClean() {
    appState.isDirty = false;
}

/**
 * Mark form as dirty (modified)
 */
export function markFormDirty() {
    appState.isDirty = true;
}

/**
 * Get current application state
 */
export function getAppState() {
    return { ...appState };
}

/**
 * Update current quote in state
 */
export function setCurrentQuote(quote) {
    appState.currentQuote = quote;
    appState.isDirty = false;
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for debugging
window.appState = appState;