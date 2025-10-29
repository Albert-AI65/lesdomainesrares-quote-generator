"""Validation utilities."""

import re
from typing import Optional


def validate_email(email: str) -> bool:
    """Validate email format.
    
    Args:
        email: Email to validate
    
    Returns:
        True if valid, False otherwise
    """
    if not email or not isinstance(email, str):
        return False
    
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """Validate French phone number.
    
    Args:
        phone: Phone number to validate
    
    Returns:
        True if valid, False otherwise
    """
    if not phone or not isinstance(phone, str):
        return False
    
    # Remove spaces and dashes
    cleaned = phone.replace(' ', '').replace('-', '').replace('.', '')
    
    # French phone: 10 digits starting with 0
    pattern = r'^0[1-9][0-9]{8}$'
    return bool(re.match(pattern, cleaned))


def format_phone(phone: str) -> str:
    """Format phone number as 01 23 45 67 89.
    
    Args:
        phone: Phone number to format
    
    Returns:
        Formatted phone number
    """
    if not phone or not isinstance(phone, str):
        return phone
    
    # Clean
    cleaned = phone.replace(' ', '').replace('-', '').replace('.', '')
    
    # Format if 10 digits
    if len(cleaned) == 10 and cleaned.isdigit():
        return f'{cleaned[0:2]} {cleaned[2:4]} {cleaned[4:6]} {cleaned[6:8]} {cleaned[8:10]}'
    
    return phone


def sanitize_string(text: str, max_length: Optional[int] = None) -> str:
    """Sanitize string input.
    
    Args:
        text: Text to sanitize
        max_length: Maximum length
    
    Returns:
        Sanitized text
    """
    if not text or not isinstance(text, str):
        return ''
    
    # Remove dangerous patterns
    dangerous = ['<script', '</script', 'javascript:', 'onerror=', 'onclick=']
    sanitized = text
    for pattern in dangerous:
        sanitized = sanitized.replace(pattern, '')
    
    # Trim
    sanitized = sanitized.strip()
    
    # Limit length
    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized
