from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Cohort, User

cohort_bp = Blueprint("cohort_bp", __name__)

@cohort_bp.route("/cohorts", methods=["POST"])
@jwt_required()
def create_cohort():
    data = request.get_json()

    if not data or "name" not in data or not data["name"].strip():
        return jsonify({"error": "Cohort name is required"}), 422

    cohort = Cohort(name=data["name"].strip())
    db.session.add(cohort)
    db.session.commit()

    return jsonify({
        "id": cohort.id,
        "name": cohort.name
    }), 201


@cohort_bp.route("/cohorts", methods=["GET"])
def get_all_cohorts():
    try:
        cohorts = Cohort.query.all()
        return jsonify([
            {
                "id": c.id,
                "name": c.name,
                "members": [
                    {
                        "id": m.id,
                        "username": m.username,
                        "email": m.email
                    } for m in c.members
                ]
            } for c in cohorts
        ])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cohort_bp.route("/cohorts/<int:id>", methods=["GET"])
def get_cohort(id):
    cohort = Cohort.query.get_or_404(id)
    return jsonify({
        "id": cohort.id,
        "name": cohort.name,
        "members": [
            {
                "id": m.id,
                "username": m.username,
                "email": m.email
            } for m in cohort.members
        ]
    })


@cohort_bp.route("/cohorts/<int:id>", methods=["PATCH"])
@jwt_required()
def update_cohort(id):
    data = request.get_json()
    cohort = Cohort.query.get_or_404(id)

    if "name" in data:
        cohort.name = data["name"]

    db.session.commit()
    return jsonify({"success": "Cohort updated"}), 200


@cohort_bp.route("/cohorts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_cohort(id):
    cohort = Cohort.query.get_or_404(id)
    db.session.delete(cohort)
    db.session.commit()
    return jsonify({"success": "Cohort deleted"}), 200


@cohort_bp.route("/cohorts/<int:cohort_id>/add_user", methods=["PATCH"])
@jwt_required()
def add_user_to_cohort(cohort_id):
    data = request.get_json()

    if not data or "user_id" not in data:
        return jsonify({"error": "user_id is required"}), 400

    cohort = Cohort.query.get_or_404(cohort_id)
    user = User.query.get_or_404(data["user_id"])

    user.cohort = cohort
    db.session.commit()

    return jsonify({
        "success": f"User {user.username} added to cohort {cohort.name}"
    }), 200


@cohort_bp.route("/cohorts/<int:cohort_id>/remove_user", methods=["PATCH"])
@jwt_required()
def remove_user_from_cohort(cohort_id):
    data = request.get_json()

    if not data or "user_id" not in data:
        return jsonify({"error": "user_id is required"}), 400

    user = User.query.get_or_404(data["user_id"])

    if user.cohort_id != cohort_id:
        return jsonify({"error": "User does not belong to this cohort"}), 400

    user.cohort = None
    db.session.commit()

    return jsonify({
        "success": f"User {user.username} removed from cohort"
    }), 200

@cohort_bp.route("/cohorts/unassigned", methods=["GET"])
@jwt_required()
def get_unassigned_users():
    unassigned = User.query.filter(User.cohort_id.is_(None)).all()
    return jsonify([user.to_dict() for user in unassigned]), 200

@cohort_bp.route("/cohorts/assign_user", methods=["PATCH"])
@jwt_required()
def assign_user_direct():
    data = request.get_json()
    user_id = data.get("user_id")
    cohort_id = data.get("cohort_id")

    user = User.query.get_or_404(user_id)
    user.cohort_id = cohort_id
    db.session.commit()
    return jsonify({"message": "User assigned"}), 200


@cohort_bp.route("/cohorts/unassign_user", methods=["PATCH"])
@jwt_required()
def unassign_user_direct():
    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query.get_or_404(user_id)
    user.cohort_id = None
    db.session.commit()
    return jsonify({"message": "User unassigned"}), 200
