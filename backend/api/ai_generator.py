"""AI generation module using Claude API."""

import json
import logging
from typing import Dict, Any, Optional
import requests
from ..config import Config

logger = logging.getLogger(__name__)


class AIGenerationError(Exception):
    """Custom exception for AI generation errors."""
    pass


def create_prompt(titre: str, adresse: str) -> str:
    """Create optimized prompt for Claude AI.
    
    Args:
        titre: Title of the venue
        adresse: Address of the venue
    
    Returns:
        Formatted prompt string
    """
    return f"""Tu es un expert en rédaction commerciale pour des événements d'entreprise haut de gamme en France.

Informations fournies :
- Titre/Nom du lieu: {titre}
- Adresse complète: {adresse}

Tu dois générer DEUX textes distincts au format JSON strict :

1. "texte_presentation" : Un texte de présentation commercial et élégant (4-6 phrases) pour la première page d'un devis. 
   - Commence par "Cher client," ou "Madame, Monsieur,"
   - Mets en valeur le lieu, son cadre exceptionnel, son positionnement géographique
   - Ton chaleureux et professionnel
   - Adapté aux événements professionnels (séminaires, soirées d'entreprise)

2. "informations_acces" : Des informations pratiques d'accès et transport (3-5 phrases)
   - Adresse complète
   - Distance depuis Paris si applicable
   - Options de transport (voiture, train, transport en commun)
   - Parkings disponibles si pertinent
   - Navettes ou informations pratiques

IMPORTANT : 
- Réponds UNIQUEMENT avec un objet JSON valide, rien d'autre
- N'invente pas de détails qui ne sont pas fournis
- Base-toi sur la réalité géographique de l'adresse fournie
- Format attendu :

{{
  "texte_presentation": "Texte ici...",
  "informations_acces": "Texte ici..."
}}

NE RÉPONDS RIEN D'AUTRE QUE LE JSON."""


def call_claude_api(prompt: str, config: Config = None) -> Dict[str, Any]:
    """Call Claude API with error handling.
    
    Args:
        prompt: The prompt to send
        config: Configuration object
    
    Returns:
        API response as dict
    
    Raises:
        AIGenerationError: If API call fails
    """
    if config is None:
        config = Config
    
    if not config.CLAUDE_API_KEY:
        raise AIGenerationError('Claude API key is not configured')
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': config.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
    }
    
    payload = {
        'model': config.CLAUDE_MODEL,
        'max_tokens': config.CLAUDE_MAX_TOKENS,
        'messages': [
            {'role': 'user', 'content': prompt}
        ]
    }
    
    try:
        logger.info(f'Calling Claude API with model: {config.CLAUDE_MODEL}')
        response = requests.post(
            config.CLAUDE_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            error_msg = f'API returned status {response.status_code}: {response.text}'
            logger.error(error_msg)
            raise AIGenerationError(error_msg)
        
        return response.json()
        
    except requests.exceptions.Timeout:
        error_msg = 'API request timed out after 30 seconds'
        logger.error(error_msg)
        raise AIGenerationError(error_msg)
    
    except requests.exceptions.RequestException as e:
        error_msg = f'API request failed: {str(e)}'
        logger.error(error_msg)
        raise AIGenerationError(error_msg)


def parse_claude_response(api_response: Dict[str, Any]) -> Dict[str, str]:
    """Parse and validate Claude API response.
    
    Args:
        api_response: Raw API response
    
    Returns:
        Parsed content with texte_presentation and informations_acces
    
    Raises:
        AIGenerationError: If response parsing fails
    """
    try:
        # Extract text from response
        content = api_response['content'][0]['text']
        
        # Clean markdown formatting if present
        content = content.replace('```json\n', '').replace('```\n', '').replace('```', '').strip()
        
        # Parse JSON
        generated_content = json.loads(content)
        
        # Validate required fields
        required_fields = ['texte_presentation', 'informations_acces']
        for field in required_fields:
            if field not in generated_content:
                raise AIGenerationError(f'Missing required field: {field}')
            
            if not generated_content[field] or not isinstance(generated_content[field], str):
                raise AIGenerationError(f'Invalid content for field: {field}')
        
        logger.info('Successfully parsed Claude response')
        return generated_content
        
    except json.JSONDecodeError as e:
        error_msg = f'Failed to parse JSON response: {str(e)}'
        logger.error(error_msg)
        raise AIGenerationError(error_msg)
    
    except (KeyError, IndexError) as e:
        error_msg = f'Unexpected API response structure: {str(e)}'
        logger.error(error_msg)
        raise AIGenerationError(error_msg)


def generate_with_ai(titre: str, adresse: str, config: Config = None) -> Dict[str, str]:
    """Generate commercial texts using Claude AI.
    
    Args:
        titre: Venue title/name
        adresse: Venue address
        config: Configuration object
    
    Returns:
        Dict with texte_presentation and informations_acces
    
    Raises:
        AIGenerationError: If generation fails
    """
    # Validate inputs
    if not titre or not titre.strip():
        raise AIGenerationError('Titre cannot be empty')
    
    if not adresse or not adresse.strip():
        raise AIGenerationError('Adresse cannot be empty')
    
    # Create prompt
    prompt = create_prompt(titre.strip(), adresse.strip())
    
    # Call API
    api_response = call_claude_api(prompt, config)
    
    # Parse and return
    return parse_claude_response(api_response)
