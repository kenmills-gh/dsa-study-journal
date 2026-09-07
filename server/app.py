from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, bcrypt, jwt

import models  # Ensures models are registered with SQLAlchemy metadata
from routes.auth import auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp)

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
        print("\n" + "=" * 50)
        print(" [1/2] Connecting to PostgreSQL Database...")
        try:
            db.create_all()
            print(" [SUCCESS] Connected! Database tables created/verified.")
        except Exception as e:
            print(f" [ERROR] Database connection failed:\n{e}")
            print("=" * 50 + "\n")
            raise e
        print("=" * 50)

    print("\n [2/2] Starting Flask server on http://127.0.0.1:5555 ...\n")
    app.run(port=5555, debug=True)
