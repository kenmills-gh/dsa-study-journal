from datetime import datetime
from extensions import db


class Problem(db.Model):
    __tablename__ = "problems"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    pattern_category = db.Column(
        db.String(50), nullable=False
    )  # e.g. Two Pointers, Sliding Window
    difficulty = db.Column(db.String(20), nullable=False)  # Easy, Medium, Hard
    status = db.Column(
        db.String(20), default="Learning"
    )  # Learning, Needs Review, Mastered
    external_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    attempt_logs = db.relationship(
        "AttemptLog", backref="problem", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "pattern_category": self.pattern_category,
            "difficulty": self.difficulty,
            "status": self.status,
            "external_url": self.external_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "total_attempts": len(self.attempt_logs),
        }
