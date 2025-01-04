import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.extensions import bcrypt, jwt, socketio, db
import logging

load_dotenv()


def create_app():
    app = Flask(__name__)

    # Configure logging
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)

    # Load environment configurations
    environment = os.getenv("FLASK_ENV", "development")
    if environment == "production":
        app.config.from_object("app.config.ProductionConfig")
    else:
        app.config.from_object("app.config.DevelopmentConfig")

    # Validate critical environment variables
    required_vars = ["SQLALCHEMY_DATABASE_URI", "SECRET_KEY"]
    for var in required_vars:
        if not app.config.get(var):
            raise ValueError(f"The environment variable {var} must be set!")

    # Initialize extensions
    try:
        db.init_app(app)
        bcrypt.init_app(app)
        jwt.init_app(app)
        cors_allowed_origins = app.config.get("CORS_ALLOWED_ORIGINS", "*")
        socketio.init_app(
            app,
            cors_allowed_origins=cors_allowed_origins
        )

        CORS(
            app,
            supports_credentials=True,
            resources={r"/api/*": {"origins": cors_allowed_origins}},
        )
    except Exception as e:
        app.logger.error(f"Error initializing extensions: {e}")
        raise

    # Import models
    from app.models import User, Message

    # Log registered tables
    app.logger.info(f"Registered tables: {db.Model.metadata.tables.keys()}")

    # Create database tables inside the app context
    with app.app_context():
        try:
            app.logger.info("Creating database tables...")
            db.create_all()
            app.logger.info("Tables created successfully.")
        except Exception as e:
            app.logger.error(f"Error creating tables: {e}")

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.messages import messages_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(messages_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api")

    return app
