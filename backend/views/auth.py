from flask import Blueprint, request, jsonify, url_for, redirect
from ..models import db, User, TokenBlocklist
from urllib.parse import urlencode
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from werkzeug.security import check_password_hash
from datetime import datetime, timezone
from flask_cors import cross_origin
import os
import logging
from ..extensions import oauth
from urllib.parse import urlencode

auth_bp = Blueprint("auth", __name__)
logger = logging.getLogger(__name__)

google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v2/',
    client_kwargs={'scope': 'openid email profile'},
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)


def create_auth_response(user, message="Login successful"):
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "status": "success",
        "message": message,
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    })


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"status": "error", "message": "Missing credentials"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"status": "error", "message": "Invalid credentials"}), 401

        if user.is_blocked:
            return jsonify({"status": "error", "message": "Account is blocked"}), 403

        return create_auth_response(user)

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"status": "error", "message": "Login failed"}), 500


@auth_bp.route('/login/google')
def google_login():
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)



@auth_bp.route('/login/google/callback')
def google_callback():
    try:
        token = google.authorize_access_token()
        user_info = google.get('userinfo').json()

        if not user_info.get('email'):
            raise ValueError("Email not available from Google")

        user = User.query.filter_by(email=user_info['email']).first()
        if not user:
            user = User(
                email=user_info['email'],
                username=user_info.get('name') or user_info['email'].split('@')[0],
            )
            user.set_password(os.urandom(16).hex())
            db.session.add(user)
            db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        params = urlencode({"token": access_token})
        return redirect(f"http://localhost:5173/?token={access_token}")

    except Exception as e:
        logger.error(f"Google OAuth error: {e}")
        params = urlencode({"error": "oauth_failed"})
        return redirect(f"http://localhost:5173/login?{params}")


from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify

@auth_bp.route("/me", methods=["GET"])
@cross_origin(
    supports_credentials=True,
    origins=["http://localhost:5173"],
    allow_headers=["Authorization", "Content-Type"]
)
@jwt_required()
def fetch_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        return jsonify({
            "status": "success",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }), 200

    except Exception as e:
        logger.error(f"/me error: {str(e)}")
        return jsonify({"status": "error", "message": "Authentication failed"}), 401


@auth_bp.route("/logout", methods=["POST"])
@cross_origin()
@jwt_required()
def logout():
    try:
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)

        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        db.session.commit()

        return jsonify({"status": "success", "message": "Logged out"}), 200

    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({"status": "error", "message": "Logout failed"}), 500
