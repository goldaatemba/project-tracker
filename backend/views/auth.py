from flask import Flask, request, jsonify, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests  # ✅
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from datetime import timezone
from flask_cors import cross_origin
import os



auth_bp = Blueprint("auth_bp", __name__)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json(force=True)
        print("📥 Received data:", data)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Missing credentials'}), 400

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):  
            access_token = create_access_token(identity=user.id)
            return jsonify({'access_token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print(" Error:", e)
        return jsonify({'error': 'Invalid JSON or server error'}), 400

    
@auth_bp.route("/me", methods=["GET"])
@jwt_required(locations=["headers"])  
def fetch_current_user():
    current_user_id = get_jwt_identity()

    if not current_user_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200

# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)

    new_blocked_token =TokenBlocklist(jti=jti, created_at=now)
    db.session.add(new_blocked_token)
    db.session.commit()
    return jsonify({"success": "Successfully logged out"}), 200


@auth_bp.route('/login/google', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def google_login():
    if request.method == "OPTIONS":
        return '', 204
    
    data = request.get_json()
    token = data.get('credential')

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        username = idinfo.get('name', email.split('@')[0])

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(username=username, email=email, password='')  # No password for Google auth
            db.session.add(user)
            db.session.commit()

        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200

    except ValueError as e:
        print(" Google token validation failed:", e)
        return jsonify({"error": "Invalid Google token"}), 400
