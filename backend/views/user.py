from flask import Flask, request, jsonify, Blueprint
from models import db, User, Project, Cohort, Member,Tech
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
# Importing Flask-Mail for email functionalities
from flask_mail import Message
from app import app, mail


user_bp = Blueprint("user_bp", __name__)


# registering user
@user_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")


    if not username or not email or not password:
        return jsonify({"error": "Username, email and password are required"}), 400
     
    username_exists = User.query.filter_by(username=username).first()
    email_exists = User.query.filter_by(email=email).first()

    if username_exists:
        return jsonify({"error": "Username already exists"}), 400

    if email_exists:
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(username=username, email=email, password = generate_password_hash(password) )
    db.session.add(new_user)

    # Sending a welcome email to the new user
    try:
        msg = Message(subject="Welcome to project tracker",
        recipients=[email],
        sender=app.config['MAIL_DEFAULT_SENDER'],
        body=f"Hello {username},\n\nThank you for registering on project tracker. We are excited to have you on board!\n\nBest regards,\nProject Tracker Team")
        mail.send(msg)        
        # Commit the new user to the database after sending the email
        db.session.commit()
        return jsonify({"success":"User created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to regsiter/send welcome email"}), 400



# update user - block/unblock user, change username, email, admin status
@user_bp.route("/update_user", methods=["PATCH"])
@jwt_required()
def update_user():  
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
  
    username = data.get("username",user.username)
    newPassword = data.get("newPassword")
    password = data.get("password")
    email = data.get("email", user.email)
    is_admin = data.get("is_admin", user.is_admin)
    is_blocked = data.get("is_blocked", user.is_blocked)

    if newPassword and password:
        if check_password_hash(user.password, password):
            user.password = generate_password_hash(newPassword)
        else:
            return jsonify({"error": "Current password is incorrect"}), 400
    
    user.username = username
    user.email = email
    user.is_admin = is_admin
    user.is_blocked = is_blocked

    #  send an email when user updates their information
    try:
        msg = Message(subject="Alert! Profile Update",
        recipients=[email],
        sender=app.config['MAIL_DEFAULT_SENDER'],
        body=f"Hello {user.username},\n\nYour profile has been updated successfully on project tracker.\n\nBest regards,\nProject Tracker Team")
        mail.send(msg)        
        # Commit the new user to the database after sending the email
        db.session.commit()
        return jsonify({"success":"User updated successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to regsiter/send welcome email"}), 400
   


# get user by id
@user_bp.route("/users/<user_id>", methods=["GET"])
def fetch_user_by_id(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_blocked": user.is_blocked,
        "created_at": user.created_at,
    }
    return jsonify(user_data), 200

# get all users
@user_bp.route("/users", methods=["GET"])
def fetch_all_users():
    users = User.query.all()

    user_list = []
    for user in users:
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "is_blocked": user.is_blocked,
            "created_at": user.created_at
        }
        user_list.append(user_data)
        
    return jsonify(user_list), 200

# delete user profile
@user_bp.route("/delete_user_profile", methods=["DELETE"])
@jwt_required()
def delete_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    #

    if not user:
        return jsonify({"error": "User not found"}), 404

   

    # if user had any projects, cohorts or  members or tech , they should be deleted as well
    projects = Project.query.filter_by(user_id=current_user_id).all()
    for project in projects:
        db.session.delete(project)
    cohorts = Cohort.query.filter_by(user_id=current_user_id).all()
    for cohort in cohorts:
        db.session.delete(cohort)
    members = Member.query.filter_by(user_id=current_user_id).all()
    for member in members:
        db.session.delete(member)

    db.session.commit()

    # delete the user profile after deleting their projects, cohorts, tech and members
    db.session.delete(user)
    db.session.commit()

    return jsonify({"success": "User deleted successfully"}), 200