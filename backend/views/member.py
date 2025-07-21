from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Member

member_bp = Blueprint("member_bp", __name__)

@member_bp.route("/members", methods=["POST"])
@jwt_required()
def add_member():
    data = request.get_json()
    member = Member(project_id=data["project_id"], user_id=data["user_id"])
    db.session.add(member)
    db.session.commit()
    return jsonify({"success": "Member added"}), 201

@member_bp.route("/members/<int:id>", methods=["GET"])
def get_member(id):
    member = Member.query.get_or_404(id)
    return jsonify(member.to_dict())

@member_bp.route("/members", methods=["GET"])
def get_all_members():
    return jsonify([m.to_dict() for m in Member.query.all()])

@member_bp.route("/members/<int:id>", methods=["PATCH"])
@jwt_required()
def update_member(id):
    data = request.get_json()
    member = Member.query.get_or_404(id)
    member.project_id = data.get("project_id", member.project_id)
    member.user_id = data.get("user_id", member.user_id)
    db.session.commit()
    return jsonify({"success": "Member updated"}), 200

@member_bp.route("/members/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_member(id):
    member = Member.query.get_or_404(id)
    db.session.delete(member)
    db.session.commit()
    return jsonify({"success": "Member deleted"}), 200
