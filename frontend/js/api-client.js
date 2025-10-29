/**
 * API Client Module
 * Handles all API communications with the backend
 */

const API_BASE_URL = window.location.origin;

/**
 * Configuration
 */
const config = {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000 // 1 second
};

/**
 * Make an API request with retry logic
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    let lastError;
    
    for (let attempt = 0; attempt < config.retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            
            const response = await fetch(url, {
                ...defaultOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
            
        } catch (error) {
            lastError = error;
            
            if (error.name === 'AbortError') {
                console.warn(`Request timeout (attempt ${attempt + 1}/${config.retries})`);
            } else {
                console.warn(`Request failed (attempt ${attempt + 1}/${config.retries}):`, error.message);
            }
            
            // Don't retry on last attempt
            if (attempt < config.retries - 1) {
                await new Promise(resolve => setTimeout(resolve, config.retryDelay * (attempt + 1)));
            }
        }
    }
    
    throw lastError;
}

/**
 * Generate AI texts for quote
 * @param {string} titre - Location title
 * @param {string} adresse - Full address
 * @returns {Promise<object>} Generated texts
 */
export async function generateAITexts(titre, adresse) {
    if (!titre || !adresse) {
        throw new Error('Le titre et l\'adresse sont requis');
    }
    
    return apiRequest('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ titre, adresse })
    });
}

/**
 * Validate quote data
 * @param {object} quoteData - Quote data to validate
 * @returns {Promise<object>} Validation result
 */
export async function validateQuote(quoteData) {
    return apiRequest('/api/validate-quote', {
        method: 'POST',
        body: JSON.stringify(quoteData)
    });
}

/**
 * Health check
 * @returns {Promise<object>} Health status
 */
export async function healthCheck() {
    return apiRequest('/health', {
        method: 'GET'
    });
}

/**
 * Test API connectivity
 * @returns {Promise<boolean>} True if API is reachable
 */
export async function testConnection() {
    try {
        await healthCheck();
        return true;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}