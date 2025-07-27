from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from models import db, TokenBlocklist
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)

<<<<<<< HEAD
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project_tracking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

=======

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://pb_db_uxkt_user:Ui8z1zdKK9UZz5GlK5kDCMVo2V2i9QBN@dpg-d20k3cre5dus73dgmi4g-a.oregon-postgres.render.com/pb_db_uxkt'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
CORS(app,
     origins=[
         "http://localhost:5173",  
         "https://project-tracker-phgl.vercel.app"
     ],
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
     allow_headers=["Content-Type", "Authorization"])

<<<<<<< HEAD
=======

>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'goldaatemba76@gmail.com'
app.config['MAIL_PASSWORD'] = 'iwra vjbu ylzn vluq'  
app.config['MAIL_DEFAULT_SENDER'] = 'goldaatemba76@gmail.com'
mail = Mail(app)

app.config['GOOGLE_CLIENT_ID'] = '54790823933-pl1q47ujvtjdefs0bvnf37qk7rhl63ku.apps.googleusercontent.com'
app.config['GOOGLE_CLIENT_SECRET'] = 'your-client-secret'
app.config['GOOGLE_DISCOVERY_URL'] = 'https://accounts.google.com/.well-known/openid-configuration'

app.config["JWT_SECRET_KEY"] = "sjusefvyilgfvksbhvfiknhalvufn"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

from views import auth_bp
from views.user import user_bp
from views.cohort import cohort_bp
from views.project import project_bp
from views.member import member_bp
from views.comments import comments_bp


app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(cohort_bp)
app.register_blueprint(project_bp)
app.register_blueprint(member_bp)
app.register_blueprint(comments_bp)

if __name__ == "__main__":
    app.run(debug=True)
