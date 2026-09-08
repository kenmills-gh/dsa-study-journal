from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.problem import Problem

problems_bp = Blueprint("problems", __name__, url_prefix="/api/problems")


@problems_bp.route("", methods=["POST"])
@jwt_required()
def create_problem():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    title = data.get("title")
    pattern_category = data.get("pattern_category")
    difficulty = data.get("difficulty")
    status = data.get("status", "Learning")
    external_url = data.get("external_url")

    if not title or not pattern_category or not difficulty:
        return (
            jsonify({"error": "Title, pattern_category, and difficulty are required"}),
            400,
        )

    new_problem = Problem(
        title=title,
        pattern_category=pattern_category,
        difficulty=difficulty,
        status=status,
        external_url=external_url,
        user_id=user_id,
    )

    db.session.add(new_problem)
    db.session.commit()

    return (
        jsonify({"message": "Problem created", "problem": new_problem.to_dict()}),
        201,
    )


@problems_bp.route("", methods=["GET"])
@jwt_required()
def get_problems():
    user_id = int(get_jwt_identity())
    problems = Problem.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_dict() for p in problems]), 200


@problems_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_problem(id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=id, user_id=user_id).first()

    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    return jsonify(problem.to_dict()), 200


@problems_bp.route("/<int:id>", methods=["PATCH"])
@jwt_required()
def update_problem(id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=id, user_id=user_id).first()

    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    data = request.get_json() or {}
    allowed_updates = [
        "title",
        "pattern_category",
        "difficulty",
        "status",
        "external_url",
    ]

    for key, value in data.items():
        if key in allowed_updates:
            setattr(problem, key, value)

    db.session.commit()
    return (
        jsonify({"message": "Problem updated", "problem": problem.to_dict()}),
        200,
    )


@problems_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_problem(id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=id, user_id=user_id).first()

    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    db.session.delete(problem)
    db.session.commit()
    return jsonify({"message": "Problem deleted successfully"}), 200
