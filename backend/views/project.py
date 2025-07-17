import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project

project_bp = Blueprint("project_bp", __name__)

@project_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    new_project = Project(
        name=data["name"],
        description=data["description"],
        github_link=data["github_link"],
        owner_id=current_user_id,
        cohort_id=data.get("cohort_id"),
        tech_id=data.get("tech_id"),
        created_at=datetime.datetime.utcnow()
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify({"success": "Project created"}), 201


@project_bp.route("/projects/<int:id>", methods=["GET"])
def get_project(id):
    project = Project.query.get_or_404(id)
    return jsonify({
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "github_link": project.github_link,
        "cohort_id": project.cohort_id,
        "tech_id": project.tech_id
    })


@project_bp.route("/projects", methods=["GET"])
def get_all_projects():
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "github_link": p.github_link,
            "cohort_id": p.cohort_id,
            "tech_id": p.tech_id
        } for p in Project.query.all()
    ])


@project_bp.route("/projects/<int:id>", methods=["PATCH"])
@jwt_required()
def update_project(id):
    data = request.get_json()
    project = Project.query.get_or_404(id)

    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)
    project.github_link = data.get("github_link", project.github_link)
    project.cohort_id = data.get("cohort_id", project.cohort_id)
    project.tech_id = data.get("tech_id", project.tech_id)

    db.session.commit()
    return jsonify({"success": "Project updated"}), 200


@project_bp.route("/projects/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"success": "Project deleted"}), 200
