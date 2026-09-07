from datetime import datetime
from extensions import db


class AttemptLog(db.Model):
    __tablename__ = "attempt_logs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey("problems.id"), nullable=False)
    confidence_score = db.Column(db.Integer, nullable=False)  # 1 to 5 scale
    time_spent_minutes = db.Column(db.Integer, nullable=False)
    code_solution = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "problem_id": self.problem_id,
            "confidence_score": self.confidence_score,
            "time_spent_minutes": self.time_spent_minutes,
            "code_solution": self.code_solution,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
