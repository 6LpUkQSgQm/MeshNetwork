from app.extensions import db


class User(db.Model):
    """Model for storing user information."""

    __tablename__ = (
        "users"
    )
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    registration_code = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"


class Message(db.Model):
    """Model for storing messages."""

    __tablename__ = "messages"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )
    user = db.relationship("User", backref=db.backref("messages", lazy=True))

    def __repr__(self):
        return f"<Message {self.content}>"

    def serialize(self):
        """Serialize the message for API responses."""
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "username": self.user.username,
        }
