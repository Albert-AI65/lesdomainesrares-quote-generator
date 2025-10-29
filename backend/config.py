"""Configuration management for Flask application."""

import os
from typing import Dict, Any


class Config:
    """Base configuration."""
    
    # Flask Core
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Server
    HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_PORT', 5000))
    
    # Claude AI
    CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY', '')
    CLAUDE_MODEL = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-20250514')
    CLAUDE_MAX_TOKENS = int(os.getenv('CLAUDE_MAX_TOKENS', 1000))
    CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5000,http://127.0.0.1:5000').split(',')
    
    # Rate Limiting
    RATELIMIT_ENABLED = os.getenv('RATELIMIT_ENABLED', 'False').lower() == 'true'
    RATELIMIT_DEFAULT = os.getenv('RATELIMIT_DEFAULT', '100 per hour')
    
    # Caching
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', 300))
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = os.getenv('LOG_FORMAT', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    @classmethod
    def validate(cls) -> Dict[str, Any]:
        """Validate critical configuration.
        
        Returns:
            Dict with validation results
        """
        issues = []
        warnings = []
        
        if not cls.CLAUDE_API_KEY or cls.CLAUDE_API_KEY == '':
            issues.append('CLAUDE_API_KEY is not set')
        
        if cls.SECRET_KEY == 'dev-secret-key-change-in-production' and not cls.DEBUG:
            warnings.append('SECRET_KEY should be changed in production')
        
        return {
            'valid': len(issues) == 0,
            'issues': issues,
            'warnings': warnings
        }
    
    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        """Convert config to dictionary (excluding secrets).
        
        Returns:
            Config as dict
        """
        return {
            'debug': cls.DEBUG,
            'host': cls.HOST,
            'port': cls.PORT,
            'claude_model': cls.CLAUDE_MODEL,
            'cors_origins': cls.CORS_ORIGINS,
            'ratelimit_enabled': cls.RATELIMIT_ENABLED,
            'cache_type': cls.CACHE_TYPE,
            'log_level': cls.LOG_LEVEL
        }


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    RATELIMIT_ENABLED = True


class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    CLAUDE_API_KEY = 'test-api-key'


# Config factory
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(env: str = None) -> Config:
    """Get configuration based on environment.
    
    Args:
        env: Environment name
    
    Returns:
        Configuration class
    """
    env = env or os.getenv('FLASK_ENV', 'development')
    return config_by_name.get(env, DevelopmentConfig)
