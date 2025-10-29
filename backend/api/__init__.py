"""API package for backend services."""

from .ai_generator import generate_with_ai
from .quotes import QuoteManager

__all__ = ['generate_with_ai', 'QuoteManager']
