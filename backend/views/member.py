from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Member, User, Project

member_bp = Blueprint("member_bp", __name__)

@member_bp.route("/members", methods=["POST"])
@jwt_required()
def add_member():
    data = request.get_json()
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "project_id and user_id are required"}), 400

    existing = Member.query.filter_by(project_id=project_id, user_id=user_id).first()
    if existing:
        return jsonify({"message": "User is already a member of this project"}), 200

    member = Member(project_id=project_id, user_id=user_id)
    db.session.add(member)
    db.session.commit()
    return jsonify(member.to_dict()), 201


@member_bp.route("/members/<int:id>", methods=["GET"])
def get_member(id):
    member = Member.query.get_or_404(id)
    return jsonify(member.to_dict()), 200


@member_bp.route("/members", methods=["GET"])
def get_all_members():
    members = Member.query.all()
    return jsonify([m.to_dict() for m in members]), 200


@member_bp.route("/members/<int:id>", methods=["PATCH"])
@jwt_required()
def update_member(id):
    member = Member.query.get_or_404(id)
    current_user_id = get_jwt_identity()

    if member.project.owner_id != current_user_id and not member.user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    member.project_id = data.get("project_id", member.project_id)
    member.user_id = data.get("user_id", member.user_id)

    db.session.commit()
    return jsonify(member.to_dict()), 200



@member_bp.route("/members/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_member(id):
    member = Member.query.get_or_404(id)
    current_user_id = get_jwt_identity()

    if member.project.owner_id != current_user_id and not member.user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": f"Removed member {id} from project"}), 200

@member_bp.route("/projects/<int:project_id>/members", methods=["GET"])
def get_members_by_project(project_id):
    members = Member.query.filter_by(project_id=project_id).all()
    return jsonify([m.to_dict() for m in members]), 200

@member_bp.route("/projects/<int:project_id>/members/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_user_from_project(project_id, user_id):
    member = Member.query.filter_by(project_id=project_id, user_id=user_id).first()

    if not member:
        return jsonify({"error": "Member not found"}), 404

    current_user_id = get_jwt_identity()
    if member.project.owner_id != current_user_id and not member.user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": f"User {user_id} removed from project {project_id}"}), 200
