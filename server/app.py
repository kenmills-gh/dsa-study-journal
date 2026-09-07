from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend communication
    CORS(app)

    # Initialize Flask plugins
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    @app.route("/health", methods=["GET"])
    def health_check():
        return (
            jsonify({"status": "healthy", "message": "DSA Journal API is running"}),
            200,
        )

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=5555, debug=True)
