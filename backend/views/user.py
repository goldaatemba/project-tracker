from flask import request, jsonify, Blueprint
from models import db, User, Project, Cohort, Member
from werkzeug.security import check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_mail import Message
from app import app, mail
from flask_cors import cross_origin

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/register", methods=["POST"])
@cross_origin(supports_credentials=True)
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({"error": "Email or username already exists"}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }), 201


@user_bp.route("/update_user", methods=["PATCH"])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON data"}), 400

    target_user = current_user
    if 'id' in data and data['id'] != current_user_id:
        if not current_user.is_admin:
            return jsonify({"error": "Admin privileges required"}), 403
        target_user = User.query.get(data['id'])
        if not target_user:
            return jsonify({"error": "Target user not found"}), 404

    errors = {}
    for field, expected_type in {
        'username': str,
        'email': str,
        'password': str,
        'newPassword': str,
        'is_admin': bool,
        'is_blocked': bool
    }.items():
        if field in data and not isinstance(data[field], expected_type):
            errors[field] = f"Must be a {expected_type.__name__}"

    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    if ('is_admin' in data or 'is_blocked' in data) and not current_user.is_admin:
        return jsonify({"error": "Admin privileges required"}), 403

    updated_fields = []
    if 'username' in data:
        target_user.username = data['username']
        updated_fields.append('username')

    if 'email' in data and data['email'] != target_user.email:
        target_user.email = data['email']
        updated_fields.append('email')

    if 'newPassword' in data:
        if 'password' not in data:
            return jsonify({"error": "Current password required"}), 400
        if not check_password_hash(target_user.password, data['password']):
            return jsonify({"error": "Current password is incorrect"}), 400
        target_user.set_password(data['newPassword'])
        updated_fields.append('password')

    if current_user.is_admin:
        if 'is_admin' in data:
            target_user.is_admin = data['is_admin']
            updated_fields.append('is_admin')
        if 'is_blocked' in data:
            target_user.is_blocked = data['is_blocked']
            updated_fields.append('is_blocked')

    if not updated_fields:
        return jsonify({"error": "No valid fields to update"}), 400

    try:
        db.session.commit()

        if 'email' not in updated_fields:
            msg = Message(
                subject="Account Update",
                recipients=[target_user.email],
                body=f"Hello {target_user.username}, your account has been updated. Changed fields: {', '.join(updated_fields)}"
            )
            mail.send(msg)

        return jsonify({
            "success": "User updated successfully",
            "updated_fields": updated_fields,
            "user": {
                "id": target_user.id,
                "username": target_user.username,
                "email": target_user.email,
                "is_admin": target_user.is_admin,
                "is_blocked": target_user.is_blocked,
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"User update failed: {e}")
        return jsonify({"error": "Failed to update profile"}), 500

@user_bp.route("/users/<int:user_id>", methods=["GET"])
def fetch_user_by_id(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_blocked": user.is_blocked,
        "created_at": user.created_at
    }), 200


@user_bp.route("/users", methods=["GET"])
def fetch_all_users():
    unassigned = request.args.get("unassigned")
<<<<<<< HEAD

=======
    
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
    if unassigned == "true":
        users = User.query.filter(User.cohort_id == None).all()
    else:
        users = User.query.all()

    user_list = [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_blocked": user.is_blocked,
        "cohort_id": user.cohort_id,
        "created_at": user.created_at
    } for user in users]

    return jsonify(user_list), 200


@user_bp.route("/delete_user_profile/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user_by_id(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Delete user error: {e}")
        return jsonify({"error": "Failed to delete user"}), 422

