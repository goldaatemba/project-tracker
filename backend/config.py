# config.py
import os
from datetime import timedelta

class Config:
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'fallback-secret-123')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_COOKIE_SECURE = False  # True in production with HTTPS
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_REFRESH_COOKIE_PATH = '/token/refresh'
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///project.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # OAuth
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
