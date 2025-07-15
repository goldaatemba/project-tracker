from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Tech

tech_bp = Blueprint("tech_bp", __name__)

@tech_bp.route("/techs", methods=["POST"])
@jwt_required()
def create_tech():
    data = request.get_json()
    tech = Tech(name=data["name"])
    db.session.add(tech)
    db.session.commit()
    return jsonify({"success": "Tech created"}), 201


@tech_bp.route("/techs/<int:id>", methods=["GET"])
def get_tech(id):
    tech = Tech.query.get_or_404(id)
    return jsonify({"id": tech.id, "name": tech.name})


@tech_bp.route("/techs", methods=["GET"])
def get_all_techs():
    return jsonify([{"id": t.id, "name": t.name} for t in Tech.query.all()])


@tech_bp.route("/techs/<int:id>", methods=["PATCH"])
@jwt_required()
def update_tech(id):
    data = request.get_json()
    tech = Tech.query.get_or_404(id)
    tech.name = data.get("name", tech.name)
    db.session.commit()
    return jsonify({"success": "Tech updated"}), 200


@tech_bp.route("/techs/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tech(id):
    tech = Tech.query.get_or_404(id)
    db.session.delete(tech)
    db.session.commit()
    return jsonify({"success": "Tech deleted"}), 200
