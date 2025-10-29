"""Flask server for LDR Quote Generator.

Improved version with:
- Modular architecture
- Better error handling
- Logging
- Configuration management
- Input validation
"""

import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import modules
from config import Config, get_config
from api.ai_generator import generate_with_ai, AIGenerationError
from api.quotes import QuoteManager

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend', static_url_path='')

# Load configuration
config_class = get_config()
app.config.from_object(config_class)

# Configure CORS
CORS(app, origins=config_class.CORS_ORIGINS)

# Configure logging
logging.basicConfig(
    level=getattr(logging, config_class.LOG_LEVEL),
    format=config_class.LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Validate configuration
config_validation = Config.validate()
if not config_validation['valid']:
    logger.error('Configuration validation failed:')
    for issue in config_validation['issues']:
        logger.error(f'  - {issue}')
    # Don't exit, but warn
    
if config_validation['warnings']:
    logger.warning('Configuration warnings:')
    for warning in config_validation['warnings']:
        logger.warning(f'  - {warning}')


@app.route('/')
def index():
    """Serve the main HTML file."""
    try:
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        logger.error(f'Error serving index: {str(e)}')
        return jsonify({'error': 'Failed to load application'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'version': '2.0.0',
        'config': Config.to_dict()
    }), 200


@app.route('/api/generate', methods=['POST'])
def generate():
    """Generate commercial texts with AI.
    
    Request body:
        {
            "titre": "Venue title",
            "adresse": "Venue address"
        }
    
    Returns:
        {
            "texte_presentation": "Generated presentation text",
            "informations_acces": "Generated access information"
        }
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.json
        
        # Extract parameters
        titre = data.get('titre', '').strip()
        adresse = data.get('adresse', '').strip()
        
        # Validate inputs
        if not titre:
            return jsonify({'error': 'Titre is required'}), 400
        
        if not adresse:
            return jsonify({'error': 'Adresse is required'}), 400
        
        logger.info(f'Generating content for: {titre}')
        
        # Generate with AI
        result = generate_with_ai(titre, adresse, Config)
        
        logger.info(f'Successfully generated content for: {titre}')
        
        return jsonify(result), 200
        
    except AIGenerationError as e:
        logger.error(f'AI generation error: {str(e)}')
        return jsonify({'error': str(e)}), 500
    
    except Exception as e:
        logger.exception(f'Unexpected error in /api/generate: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/validate-quote', methods=['POST'])
def validate_quote():
    """Validate quote data structure.
    
    Request body:
        {
            Complete quote data object
        }
    
    Returns:
        {
            "valid": true/false,
            "errors": ["error messages"]
        }
    """
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        data = request.json
        
        # Sanitize data
        sanitized_data = QuoteManager.sanitize_quote_data(data)
        
        # Validate
        is_valid, errors = QuoteManager.validate_quote_data(sanitized_data)
        
        if is_valid:
            # Create summary
            summary = QuoteManager.create_quote_summary(sanitized_data)
            return jsonify({
                'valid': True,
                'errors': [],
                'summary': summary
            }), 200
        else:
            return jsonify({
                'valid': False,
                'errors': errors
            }), 400
            
    except Exception as e:
        logger.exception(f'Error in /api/validate-quote: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    logger.error(f'Internal server error: {str(error)}')
    return jsonify({'error': 'Internal server error'}), 500


def print_startup_banner():
    """Print startup banner with configuration info."""
    print("")
    print("=" * 70)
    print("  🏰 GÉNÉRATEUR DE DEVIS LDR - SERVEUR DÉMARRÉ")
    print("=" * 70)
    print("")
    print(f"  ✅ Version: 2.0.0")
    print(f"  ✅ Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"  ✅ Serveur actif sur : http://{Config.HOST}:{Config.PORT}")
    print(f"  ✅ Debug mode: {Config.DEBUG}")
    print("")
    print("  📡 Endpoints disponibles:")
    print(f"     GET  /               - Interface principale")
    print(f"     GET  /health         - Health check")
    print(f"     POST /api/generate   - Génération IA")
    print(f"     POST /api/validate-quote - Validation devis")
    print("")
    print("  💡 Pour arrêter : Appuyez sur Ctrl+C")
    print("")
    print("=" * 70)
    print("")


if __name__ == '__main__':
    print_startup_banner()
    
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
