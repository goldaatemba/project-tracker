from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Tech

tech_bp = Blueprint("tech_bp", __name__)

# Create Tech
@tech_bp.route("/techs", methods=["POST"])
@jwt_required()
def create_tech():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Tech name is required"}), 400

    existing_tech = Tech.query.filter_by(name=name).first()
    if existing_tech:
        return jsonify({"error": "Tech with this name already exists"}), 400

    tech = Tech(name=name)
    db.session.add(tech)
    db.session.commit()

    return jsonify({"id": tech.id, "name": tech.name, "message": "Tech created"}), 201

# Get Single Tech
@tech_bp.route("/techs/<int:id>", methods=["GET"])
def get_tech(id):
    tech = Tech.query.get_or_404(id)
    return jsonify({"id": tech.id, "name": tech.name})

# Get All Techs
@tech_bp.route("/techs", methods=["GET"])
def get_all_techs():
    techs = Tech.query.all()
    return jsonify([
        {"id": tech.id, "name": tech.name}
        for tech in techs
    ])

# Update Tech
@tech_bp.route("/techs/<int:id>", methods=["PATCH"])
@jwt_required()
def update_tech(id):
    tech = Tech.query.get_or_404(id)
    data = request.get_json()
    new_name = data.get("name")

    if new_name:
        existing_tech = Tech.query.filter_by(name=new_name).first()
        if existing_tech and existing_tech.id != tech.id:
            return jsonify({"error": "Another tech with this name already exists"}), 400
        tech.name = new_name

    db.session.commit()
    return jsonify({"id": tech.id, "name": tech.name, "message": "Tech updated"}), 200

# Delete Tech
@tech_bp.route("/techs/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tech(id):
    tech = Tech.query.get_or_404(id)
    db.session.delete(tech)
    db.session.commit()
    return jsonify({"message": f"Tech '{tech.name}' deleted successfully"}), 200
