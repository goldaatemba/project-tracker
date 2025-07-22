import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, Member, User, Cohort

project_bp = Blueprint("project_bp", __name__)

@project_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data.get("name") or not data.get("description") or not data.get("github_link"):
        return jsonify({"error": "Missing required fields"}), 400

    cohort_id = data.get("cohort_id")
    if cohort_id:
        cohort = Cohort.query.get(cohort_id)
        if not cohort:
            return jsonify({"error": "Cohort does not exist"}), 400

    new_project = Project(
        name=data["name"],
        description=data["description"],
        github_link=data["github_link"],
        owner_id=current_user_id,
        cohort_id=cohort_id,
        tech=data.get("tech"),  # text field
        created_at=datetime.datetime.utcnow()
    )

    db.session.add(new_project)
    db.session.commit()
    return jsonify({"success": "Project created", "id": new_project.id}), 201


@project_bp.route("/projects/<int:id>", methods=["GET"])
def get_project(id):
    project = Project.query.get_or_404(id)

    return jsonify({
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "github_link": project.github_link,
        "cohort": {
                "id": project.cohort.id,
                "name": project.cohort.name
            } if project.cohort else None,
        "stack": project.tech if project.tech else "Unknown",
        "created_at": project.created_at,
        "owner_id": project.owner_id,
        "owner": project.owner.username if project.owner else None,
        "members": [member.user.username for member in project.members if member.user]
    })


@project_bp.route("/projects", methods=["GET"])
def get_all_projects():
    projects = Project.query.all()
    
    result = []
    for p in projects:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "github_link": p.github_link,
            "cohort_id": p.cohort_id,
            "cohort": {
                "id": p.cohort.id,
                "name": p.cohort.name
            } if p.cohort else None,
            "stack": p.tech or "Unknown",  # alias 'tech' as 'stack'
            "created_at": p.created_at.strftime('%Y-%m-%d') if p.created_at else None,
            "owner_id": p.owner_id,
            "owner": p.owner.username if p.owner else None,
            "members": [member.user.username for member in p.members if member.user]
        })

    return jsonify(result)

@project_bp.route("/projects/<int:id>", methods=["PATCH"])
@jwt_required()
def update_project(id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)

    if project.owner_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    cohort_id = data.get("cohort_id")
    if cohort_id:
        cohort = Cohort.query.get(cohort_id)
        if not cohort:
            return jsonify({"error": "Cohort does not exist"}), 400

    project.name = data.get("name", project.name)
    project.description = data.get("description", project.description)
    project.github_link = data.get("github_link", project.github_link)
    project.cohort_id = cohort_id or project.cohort_id
    project.tech = data.get("tech", project.tech)

    db.session.commit()
    return jsonify({"success": "Project updated"}), 200


@project_bp.route("/projects/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_project(id):
    current_user_id = get_jwt_identity()
    project = Project.query.get_or_404(id)

    if project.owner_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(project)
    db.session.commit()
    return jsonify({"success": "Project deleted"}), 200
