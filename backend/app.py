from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from models import db, TokenBlocklist
from dotenv import load_dotenv
load_dotenv()


# Initialize Flask App
app = Flask(__name__)

# Database Config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project_tracking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

# CORS Config
CORS(app,
     origins=["http://localhost:5173"],
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"])

# Mail Config
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'goldaatemba76@gmail.com'
app.config['MAIL_PASSWORD'] = 'iwra vjbu ylzn vluq'  # Consider moving this to environment variable!
app.config['MAIL_DEFAULT_SENDER'] = 'goldaatemba76@gmail.com'
mail = Mail(app)

# Google OAuth Config
app.config['GOOGLE_CLIENT_ID'] = '54790823933-pl1q47ujvtjdefs0bvnf37qk7rhl63ku.apps.googleusercontent.com'
app.config['GOOGLE_CLIENT_SECRET'] = 'your-client-secret'
app.config['GOOGLE_DISCOVERY_URL'] = 'https://accounts.google.com/.well-known/openid-configuration'

# JWT Config
app.config["JWT_SECRET_KEY"] = "sjusefvyilgfvksbhvfiknhalvufn"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

jwt = JWTManager(app)

# JWT Blocklist Loader
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# Register Blueprints
from views import auth_bp
from views.user import user_bp
from views.cohort import cohort_bp
from views.project import project_bp
from views.member import member_bp
from views.tech import tech_bp

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(cohort_bp)
app.register_blueprint(project_bp)
app.register_blueprint(member_bp)
app.register_blueprint(tech_bp)

# Run App
if __name__ == "__main__":
    app.run(debug=True)