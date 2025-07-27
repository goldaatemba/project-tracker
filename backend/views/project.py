import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, Member, User, Cohort
from flask_cors import cross_origin

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
<<<<<<< HEAD
        tech=data.get("tech"),
=======
        tech=data.get("tech"),  
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
        created_at=datetime.datetime.utcnow()
    )

    db.session.add(new_project)
    db.session.commit()
    return jsonify({"success": "Project created", "id": new_project.id}), 201

@project_bp.route("/projects/<int:id>", methods=["GET"])
<<<<<<< HEAD
@cross_origin()
=======
@cross_origin() 
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
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
        "created_at": project.created_at.isoformat() if project.created_at else None,  # <- FIXED THIS
        "owner_id": project.owner_id,
        "owner": {
            "id": project.owner.id,
            "username": project.owner.username
        } if project.owner else None,
        "members": [
            {
                "id": member.user.id,
                "username": member.user.username,
                "email": member.user.email
            }
            for member in project.members if member.user
        ]
    }), 200

@project_bp.route("/projects", methods=["GET"])
def get_all_projects():
    projects = Project.query.all()
<<<<<<< HEAD

=======
    
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
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
<<<<<<< HEAD
            "stack": p.tech or "Unknown",
=======
            "stack": p.tech or "Unknown", 
>>>>>>> 724b19b537b6a55800761f0ce22fe93355c3e8ef
            "created_at": p.created_at.strftime('%Y-%m-%d') if p.created_at else None,
            "owner_id": p.owner_id,
            "owner": p.owner.username if p.owner else None,
            "members": [member.user.username for member in p.members if member.user]
        })

    return jsonify(result)


@project_bp.route("/projects/<int:id>", methods=["PATCH"])
@jwt_required()
def update_project(id):
    user_id = get_jwt_identity()
    project = Project.query.get(id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    user = User.query.get(user_id)
    if not (project.owner_id == user_id or user.is_admin):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    field_mapping = {
        "title": "name",
        "description": "description",
        "link": "github_link",
    }

    for field, model_field in field_mapping.items():
        if field in data:
            setattr(project, model_field, data[field])

    db.session.commit()

    return jsonify({
        "success": "Project updated successfully",
        "project": {
            "id": project.id,
            "title": project.name,
            "description": project.description,
            "link": project.github_link,
        }
    }), 200

@project_bp.route("/projects/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_project(id):
    user_id = get_jwt_identity()
    print("Received DELETE for project ID:", id)
    print("Current user ID from token:", user_id)

    project = Project.query.get(id)
    if not project:
        print("Project not found.")
        return jsonify({"error": "Project not found"}), 404

    user = User.query.get(user_id)
    print("Requesting user is admin?", user.is_admin)

    if not (project.owner_id == user_id or user.is_admin):
        print("Unauthorized attempt to delete project.")
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(project)
    db.session.commit()

    print("Project deleted.")
    return jsonify({"message": "Project deleted successfully"}), 200

@project_bp.route("/projects/filters", methods=["GET"])
@jwt_required(optional=True)
def get_project_filters():
    cohorts = [{"id": c.id, "name": c.name} for c in Cohort.query.order_by(Cohort.name).all()]
    users = [{"id": u.id, "username": u.username} for u in User.query.order_by(User.username).all()]
    stacks = db.session.query(Project.tech).distinct().filter(Project.tech.isnot(None)).all()

    return jsonify({
        "cohorts": cohorts,
        "users": users,
        "stacks": [s[0] for s in stacks if s[0]]
    })
