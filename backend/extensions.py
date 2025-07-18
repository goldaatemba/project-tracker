from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
mail = Mail()
jwt = JWTManager()
oauth = OAuth()
cors = CORS()