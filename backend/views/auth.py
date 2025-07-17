from flask import Flask, request, jsonify, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from datetime import timezone
from flask_cors import cross_origin


auth_bp = Blueprint("auth_bp", __name__)



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

        # Dummy example: replace with actual query
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):  # Assuming hashed check
            access_token = create_access_token(identity=user.id)
            return jsonify({'access_token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({'error': 'Invalid JSON or server error'}), 400

    
#  fetching logged in user
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def fetch_current_user():
    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_blocked": user.is_blocked,
        "created_at": user.created_at
    }
    return jsonify(user_data), 200



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