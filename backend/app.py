from flask import Flask
from dotenv import load_dotenv
from datetime import timedelta
from .config import Config 
import os
from .extensions import db, migrate, mail, jwt, oauth, cors

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    app.config.from_object(Config)
    print("GOOGLE_CLIENT_ID:", os.getenv("GOOGLE_CLIENT_ID"))
    print("GOOGLE_CLIENT_SECRET:", os.getenv("GOOGLE_CLIENT_SECRET"))


    # Configuration
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': os.getenv('DATABASE_URL', 'sqlite:///project.db'),
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'JWT_SECRET_KEY': os.getenv('JWT_SECRET', 'fallback-secret'),
        'JWT_ACCESS_TOKEN_EXPIRES': timedelta(hours=24),
        'JWT_TOKEN_LOCATION': ['cookies'],
        'JWT_COOKIE_SECURE': False,
        'JWT_COOKIE_SAMESITE': 'Lax',
        'MAIL_SERVER': 'smtp.gmail.com',
        'MAIL_PORT': 587,
        'MAIL_USE_TLS': True,
        'GOOGLE_CLIENT_ID': os.getenv('GOOGLE_CLIENT_ID'),
        'GOOGLE_CLIENT_SECRET': os.getenv('GOOGLE_CLIENT_SECRET'),
        'MAIL_USERNAME': os.getenv('MAIL_USER'),
        'SECRET_KEY': os.getenv('FLASK_SECRET', '5bfe3c2d1d9b4e5e9f3a2b7b1c7d8432a1d6f7e4a9c8d2b5e7f9a1b3c4d6e8f0'), 
        'MAIL_PASSWORD': os.getenv('MAIL_PASSWORD')
        
    })

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    jwt.init_app(app)
    oauth.init_app(app)
    cors.init_app(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    client_kwargs={'scope': 'openid email profile'}
)

    # Register blueprints (lazy import)
    with app.app_context():
        from .views.auth import auth_bp
        from .views.user import user_bp
        from .views.cohort import cohort_bp
        from .views.member import member_bp
        from .views.project import project_bp
        from .views.tech import tech_bp
        
        app.register_blueprint(auth_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(cohort_bp)
        app.register_blueprint(member_bp)
        app.register_blueprint(project_bp)
        app.register_blueprint(tech_bp)

    return app