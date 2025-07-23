from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Comment, Project, User

comments_bp = Blueprint("comments_bp", __name__)

@comments_bp.route("/projects/<int:project_id>/comments", methods=["GET"])
def get_comments(project_id):
    project = Project.query.get_or_404(project_id)
    comments = [comment.to_dict() for comment in project.comments]
    return jsonify(comments), 200

@comments_bp.route("/projects/<int:project_id>/comments", methods=["POST"])
@jwt_required()
def post_comment(project_id):
    data = request.get_json()
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"error": "Comment cannot be empty"}), 400

    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    project = Project.query.get_or_404(project_id)

    comment = Comment(content=content, user=user, project=project)
    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201

@comments_bp.route("/comments/<int:comment_id>", methods=["PUT"])
@jwt_required()
def edit_comment(comment_id):
    user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)

    if comment.user_id != user_id and not User.query.get(user_id).is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"error": "Comment cannot be empty"}), 400

    comment.content = content
    db.session.commit()

    return jsonify(comment.to_dict()), 200


@comments_bp.route("/comments/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)

    if comment.user_id != user_id and not User.query.get(user_id).is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted"}), 200
