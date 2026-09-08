from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.attempt_log import AttemptLog
from models.problem import Problem

attempts_bp = Blueprint("attempts", __name__, url_prefix="/api")


@attempts_bp.route("/problems/<int:problem_id>/attempts", methods=["POST"])
@jwt_required()
def create_attempt(problem_id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=problem_id, user_id=user_id).first()

    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    data = request.get_json() or {}

    confidence_score = data.get("confidence_score")
    time_spent_minutes = data.get("time_spent_minutes")
    code_solution = data.get("code_solution")
    notes = data.get("notes")

    if confidence_score is None or time_spent_minutes is None:
        return (
            jsonify(
                {"error": "confidence_score (1-5) and time_spent_minutes are required"}
            ),
            400,
        )

    new_attempt = AttemptLog(
        user_id=user_id,
        problem_id=problem.id,
        confidence_score=confidence_score,
        time_spent_minutes=time_spent_minutes,
        code_solution=code_solution,
        notes=notes,
    )

    db.session.add(new_attempt)
    db.session.commit()

    return (
        jsonify({"message": "Attempt logged", "attempt": new_attempt.to_dict()}),
        201,
    )


@attempts_bp.route("/problems/<int:problem_id>/attempts", methods=["GET"])
@jwt_required()
def get_problem_attempts(problem_id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=problem_id, user_id=user_id).first()

    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    attempts = AttemptLog.query.filter_by(problem_id=problem.id, user_id=user_id).all()
    return jsonify([a.to_dict() for a in attempts]), 200


@attempts_bp.route("/attempts/<int:id>", methods=["PATCH"])
@jwt_required()
def update_attempt(id):
    user_id = int(get_jwt_identity())
    attempt = AttemptLog.query.filter_by(id=id, user_id=user_id).first()

    if not attempt:
        return jsonify({"error": "Attempt log not found"}), 404

    data = request.get_json() or {}
    allowed_updates = [
        "confidence_score",
        "time_spent_minutes",
        "code_solution",
        "notes",
    ]

    for key, value in data.items():
        if key in allowed_updates and hasattr(attempt, key):
            setattr(attempt, key, value)

    db.session.commit()
    return (
        jsonify({"message": "Attempt log updated", "attempt": attempt.to_dict()}),
        200,
    )


@attempts_bp.route("/attempts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_attempt(id):
    user_id = int(get_jwt_identity())
    attempt = AttemptLog.query.filter_by(id=id, user_id=user_id).first()

    if not attempt:
        return jsonify({"error": "Attempt log not found"}), 404

    db.session.delete(attempt)
    db.session.commit()
    return jsonify({"message": "Attempt log deleted successfully"}), 200
