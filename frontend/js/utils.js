/**
 * Utility functions for the quote generator
 * @module utils
 */

/**
 * Format price with French locale
 * @param {number} value - Price value
 * @returns {string} Formatted price
 */
export function formatPrice(value) {
  const fixed = parseFloat(value).toFixed(2);
  const [integer, decimal] = fixed.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedInteger + ',' + decimal + ' €';
}

/**
 * Capitalize text with French grammar rules
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalizeText(text) {
  if (!text) return text;
  
  const lowercaseWords = ['de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'au', 'aux', 'et', 'ou', 'à', 'en', 'dans', 'sur', 'pour', 'par'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (lowercaseWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase())
    .replace(/(-\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
}

/**
 * Format French phone number
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export function formatPhone(phone) {
  if (!phone) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  return phone;
}

/**
 * Clean text by removing dangerous characters
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[""„‟″‶〝〞〟＂"]/g, '')
    .replace(/[''‚‛′‵`´']/g, '')
    .replace(/[…]/g, '...')
    .replace(/[–—−]/g, '-')
    .replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g, ' ');
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show notification
 * @param {string} message - Message to show
 * @param {string} type - Type (success, error, info, warning)
 * @param {number} duration - Duration in ms
 */
export function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
  `;
  
  const colors = {
    success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
    error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
    warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
    info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
  };
  
  const style = colors[type] || colors.info;
  notification.style.backgroundColor = style.bg;
  notification.style.color = style.color;
  notification.style.border = `1px solid ${style.border}`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone format (French)
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid
 */
export function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && cleaned.startsWith('0');
}

// Add CSS animations
if (!document.getElementById('utils-animations')) {
  const style = document.createElement('style');
  style.id = 'utils-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
