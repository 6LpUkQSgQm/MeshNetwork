from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, Unauthorized
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register_user():
    """Register a new user."""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    registration_code = data.get("registration_code")

    if not username or not password or not registration_code:
        raise BadRequest("All fields are required.")
    if registration_code != "123456":
        raise Unauthorized("Invalid registration code.")
    if User.query.filter_by(username=username).first():
        raise BadRequest("Username already exists.")

    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username, password=hashed_password, registration_code=registration_code
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login_user():
    """Login a user and return a JWT."""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        raise Unauthorized("Invalid username or password.")

    access_token = create_access_token(identity=str(user.id))
    return jsonify(
        access_token=access_token, user={"id": user.id, "username": user.username}
    )
