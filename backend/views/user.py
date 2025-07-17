from flask import request, jsonify, Blueprint
from models import db, User, Project, Cohort, Member, Tech
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies
from flask_mail import Message
from app import app, mail

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
        return jsonify({"error": "Username already exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(
        username=username,
        email=email,
        password=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()

    # ✅ Generate JWT token
    access_token = create_access_token(identity=new_user.id)

    # ✅ Send JWT in cookie
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


# Update user - change username/email/password, block/unblock, make admin
@user_bp.route("/update_user", methods=["PATCH"])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    username = data.get("username", user.username)
    new_password = data.get("newPassword")
    current_password = data.get("password")
    email = data.get("email", user.email)
    is_admin = data.get("is_admin", user.is_admin)
    is_blocked = data.get("is_blocked", user.is_blocked)

    if new_password and current_password:
        if check_password_hash(user.password, current_password):
            user.password = generate_password_hash(new_password)
        else:
            return jsonify({"error": "Current password is incorrect"}), 400

    user.username = username
    user.email = email
    user.is_admin = is_admin
    user.is_blocked = is_blocked

    try:
        msg = Message(
            subject="Alert! Profile Update",
            recipients=[email],
            sender=app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {user.username},\n\nYour profile was successfully updated on Project Tracker.\n\n— Project Tracker Team"
        )
        mail.send(msg)
        db.session.commit()
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
        return jsonify({"error": f"Failed to update or send email: {str(e)}"}), 400


# Get a single user by ID
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


# Get all users
@user_bp.route("/users", methods=["GET"])
def fetch_all_users():
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

    # Delete related projects
    for project in Project.query.filter_by(user_id=current_user_id).all():
        db.session.delete(project)

    # Delete related cohorts
    for cohort in Cohort.query.filter_by(user_id=current_user_id).all():
        db.session.delete(cohort)

    # Delete related members
    for member in Member.query.filter_by(user_id=current_user_id).all():
        db.session.delete(member)

    # Delete related techs
    for tech in Tech.query.filter_by(user_id=current_user_id).all():
        db.session.delete(tech)

    db.session.commit()

    # Delete the user last
    db.session.delete(user)
    db.session.commit()

    return jsonify({"success": "User deleted successfully"}), 200