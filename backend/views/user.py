# views/user.py
from flask import request, jsonify, Blueprint, current_app
from ..models import db, User, Project, Cohort, Member, Tech
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies, unset_jwt_cookies
from flask_mail import Message
from ..extensions import mail, jwt 

user_bp = Blueprint("user_bp", __name__)


# Register a new user
@user_bp.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409  # Changed to 409 Conflict

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409  # Changed to 409 Conflict

    try:
        new_user = User(username=username, email=email)
        new_user.set_password(password)  # This handles the hashing

        
        db.session.add(new_user)
        db.session.commit()

        # Generate JWT token
        access_token = create_access_token(identity=new_user.id)

        # Send JWT in cookie
        response = jsonify({
            "message": "Registration successful",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        })
        set_access_cookies(response, access_token)
        return response, 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


# Update user - change username/email/password, block/unblock, make admin
@user_bp.route("/update_user", methods=["PATCH"])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    # Check if username is being changed to one that already exists
    if "username" in data and data["username"] != user.username:
        if User.query.filter_by(username=data["username"]).first():
            return jsonify({"error": "Username already exists"}), 409

    # Check if email is being changed to one that already exists
    if "email" in data and data["email"] != user.email:
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already exists"}), 409

    try:
        if "newPassword" in data and "password" in data:
            if check_password_hash(user.password, data["password"]):
                user.password = generate_password_hash(data["newPassword"])
            else:
                return jsonify({"error": "Current password is incorrect"}), 401

        if "username" in data:
            user.username = data["username"]
        
        if "email" in data:
            user.email = data["email"]
        
        # Only admins can change these fields
        if "is_admin" in data and user.is_admin:
            user.is_admin = data["is_admin"]
        
        if "is_blocked" in data and user.is_admin:
            user.is_blocked = data["is_blocked"]

        db.session.commit()

        # Send email notification
        try:
            msg = Message(
                subject="Alert! Profile Update",
                recipients=[user.email],
                sender=current_app.config['MAIL_DEFAULT_SENDER'],
                body=f"Hello {user.username},\n\nYour profile was successfully updated on Project Tracker.\n\n— Project Tracker Team"
            )
            mail.send(msg)
        except Exception as e:
            current_app.logger.error(f"Failed to send email: {str(e)}")

        return jsonify({
            "success": "User updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin,
                "is_blocked": user.is_blocked
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update user: {str(e)}"}), 500


# Get a single user by ID
@user_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
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


# Get all users
@user_bp.route("/users", methods=["GET"])
@jwt_required()
def fetch_all_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    users = User.query.all()
    user_list = [{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_blocked": user.is_blocked,
        "created_at": user.created_at
    } for user in users]

    return jsonify(user_list), 200


# Delete the current user's profile and related data
@user_bp.route("/delete_user_profile", methods=["DELETE"])
@jwt_required()
def delete_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        # Delete related projects
        Project.query.filter_by(user_id=current_user_id).delete()
        
        # Delete related cohorts
        Cohort.query.filter_by(user_id=current_user_id).delete()
        
        # Delete related members
        Member.query.filter_by(user_id=current_user_id).delete()
        
        # Delete related techs
        Tech.query.filter_by(user_id=current_user_id).delete()

        # Delete the user
        db.session.delete(user)
        db.session.commit()

        # Clear JWT cookies
        response = jsonify({"success": "User deleted successfully"})
        unset_jwt_cookies(response)
        return response, 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete user: {str(e)}"}), 500