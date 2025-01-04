from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Message, User
from app.extensions import socketio

messages_bp = Blueprint("messages", __name__)


@messages_bp.route("/messages", methods=["GET"])
@jwt_required()
def get_messages():
    """Fetch all messages with pagination."""
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    messages = Message.query.order_by(Message.timestamp.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify(
        {
            "messages": [msg.serialize() for msg in messages.items],
            "total": messages.total,
            "page": messages.page,
            "pages": messages.pages,
        }
    )


@messages_bp.route("/messages", methods=["POST"])
@jwt_required()
def post_message():
    """Create a new message."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 401

    data = request.get_json()
    content = data.get("content", "").strip()
    if not content:
        return jsonify({"error": "Message content cannot be empty"}), 400

    new_message = Message(content=content, user_id=user.id)
    db.session.add(new_message)
    db.session.commit()
    
    serialized_message = new_message.serialize()
    socketio.emit("new_message", serialized_message)

    return jsonify(new_message.serialize()), 201
