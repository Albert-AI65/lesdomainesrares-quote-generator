"""Quote management module for CRUD operations."""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

logger = logging.getLogger(__name__)


class QuoteManager:
    """Manager for quote operations.
    
    Future: Will handle database CRUD operations.
    Currently provides structure for quote data.
    """
    
    @staticmethod
    def validate_quote_data(data: Dict[str, Any]) -> tuple[bool, List[str]]:
        """Validate quote data structure.
        
        Args:
            data: Quote data to validate
        
        Returns:
            Tuple of (is_valid, error_messages)
        """
        errors = []
        
        # Required fields
        required_fields = [
            'presentationTitle',
            'prestationAddress',
            'sendDate',
            'eventDate',
            'quoteObject',
            'clientCompany',
            'clientContact',
            'clientEmail',
            'clientPhone'
        ]
        
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f'Missing required field: {field}')
        
        # Validate email format
        if 'clientEmail' in data and data['clientEmail']:
            email = data['clientEmail']
            if '@' not in email or '.' not in email.split('@')[1]:
                errors.append('Invalid email format')
        
        # Validate phone format (basic)
        if 'clientPhone' in data and data['clientPhone']:
            phone = data['clientPhone'].replace(' ', '').replace('-', '')
            if not phone.isdigit() or len(phone) < 10:
                errors.append('Invalid phone format')
        
        # Validate quote lines
        if 'quoteLines' not in data or not isinstance(data['quoteLines'], list):
            errors.append('quoteLines must be a non-empty array')
        elif len(data['quoteLines']) == 0:
            errors.append('At least one quote line is required')
        else:
            for idx, line in enumerate(data['quoteLines']):
                if not line.get('description'):
                    errors.append(f'Quote line {idx + 1}: description is required')
                if not line.get('quantity') or line['quantity'] <= 0:
                    errors.append(f'Quote line {idx + 1}: quantity must be > 0')
                if not line.get('unitPrice') or line['unitPrice'] < 0:
                    errors.append(f'Quote line {idx + 1}: unitPrice must be >= 0')
        
        return len(errors) == 0, errors
    
    @staticmethod
    def create_quote_summary(data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a summary of quote data.
        
        Args:
            data: Full quote data
        
        Returns:
            Quote summary
        """
        total_ht = sum(
            line['quantity'] * line['unitPrice'] 
            for line in data.get('quoteLines', []) 
            if not line.get('isOption', False)
        )
        
        markup = data.get('markup', 0) / 100
        total_ht_with_markup = total_ht * (1 + markup)
        
        total_tva = sum(
            line['quantity'] * line['unitPrice'] * (1 + markup) * (line.get('tvaRate', 20) / 100)
            for line in data.get('quoteLines', [])
            if not line.get('isOption', False)
        )
        
        total_ttc = total_ht_with_markup + total_tva
        
        return {
            'quoteNumber': data.get('quoteNumber', 'N/A'),
            'clientCompany': data.get('clientCompany', 'N/A'),
            'eventDate': data.get('eventDate', 'N/A'),
            'totalHT': round(total_ht, 2),
            'totalHTWithMarkup': round(total_ht_with_markup, 2),
            'totalTVA': round(total_tva, 2),
            'totalTTC': round(total_ttc, 2),
            'lineCount': len(data.get('quoteLines', [])),
            'createdAt': datetime.now().isoformat()
        }
    
    @staticmethod
    def sanitize_quote_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize and clean quote data.
        
        Args:
            data: Raw quote data
        
        Returns:
            Cleaned quote data
        """
        # Remove any script tags or dangerous content
        def clean_string(s: str) -> str:
            if not isinstance(s, str):
                return s
            # Basic XSS prevention
            dangerous_patterns = ['<script', '</script', 'javascript:', 'onerror=', 'onclick=']
            cleaned = s
            for pattern in dangerous_patterns:
                cleaned = cleaned.replace(pattern, '')
            return cleaned.strip()
        
        # Recursively clean all string values
        def deep_clean(obj):
            if isinstance(obj, dict):
                return {k: deep_clean(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [deep_clean(item) for item in obj]
            elif isinstance(obj, str):
                return clean_string(obj)
            return obj
        
        return deep_clean(data)
