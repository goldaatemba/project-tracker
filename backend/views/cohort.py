from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Cohort

cohort_bp = Blueprint("cohort_bp", __name__)

@cohort_bp.route("/cohorts", methods=["POST"])
@jwt_required()
def create_cohort():
    data = request.get_json()
    cohort = Cohort(name=data["name"])
    db.session.add(cohort)
    db.session.commit()
    return jsonify({"success": "Cohort created"}), 201


@cohort_bp.route("/cohorts/<int:id>", methods=["GET"])
def get_cohort(id):
    cohort = Cohort.query.get_or_404(id)
    return jsonify({"id": cohort.id, "name": cohort.name})


@cohort_bp.route("/cohorts", methods=["GET"])
def get_all_cohorts():
    return jsonify([{"id": c.id, "name": c.name} for c in Cohort.query.all()])


@cohort_bp.route("/cohorts/<int:id>", methods=["PATCH"])
@jwt_required()
def update_cohort(id):
    data = request.get_json()
    cohort = Cohort.query.get_or_404(id)
    cohort.name = data.get("name", cohort.name)
    db.session.commit()
    return jsonify({"success": "Cohort updated"}), 200


@cohort_bp.route("/cohorts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_cohort(id):
    cohort = Cohort.query.get_or_404(id)
    db.session.delete(cohort)
    db.session.commit()
    return jsonify({"success": "Cohort deleted"}), 200
