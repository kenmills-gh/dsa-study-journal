# server/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Health check route
    @app.route("/health", methods=["GET"])
    def health_check():
        return (
            jsonify({"status": "healthy", "message": "DSA Journal API is running"}),
            200,
        )

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()  # Creates PostgreSQL tables if they don't exist
    app.run(port=5555, debug=True)
